import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useDispatch } from 'react-redux'
import { get } from 'lodash-es'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { useTranslation } from 'react-i18next'
import rebalanceAbi from 'config/abi/rebalance.json'
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
  useMatchBreakpoints,
} from '@fingerlabs/definixswap-uikit-v2'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import * as klipProvider from 'hooks/klipProvider'
import { getAbiRebalanceByName } from 'hooks/hookHelper'
import { getCustomContract } from 'utils/erc20'
import { getAddress } from 'utils/addressHelpers'
import { useToast } from 'state/hooks'
import useWallet from 'hooks/useWallet'
import { fetchBalances, fetchRebalanceBalances } from '../../../state/wallet'

import CardHeading from './CardHeading'
import SpaceBetweenFormat from './SpaceBetweenFormat'
import InlineAssetRatioLabel from './InlineAssetRatioLabel'
import { isKlipConnector } from 'hooks/useApprove'
import { getEstimateGas } from 'utils/callHelpers'

const WithdrawCalculateModal = ({
  setTx,
  currentInput,
  isSimulating,
  toAllAssets,
  rebalance,
  selectedToken,
  currentBalance,
  tokenList,
  estimatedValue,
  onNext,
  onDismiss = () => null,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { toastSuccess, toastError } = useToast()

  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const { setShowModal } = React.useContext(KlipModalContext())
  const { account, klaytn, connector } = useWallet()
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleLocalStorage = async (tx) => {
    const rebalanceAddress: string = getAddress(get(rebalance, 'address'))
    const { transactionHash } = tx
    const myInvestTxns = JSON.parse(
      localStorage.getItem(`my_invest_tx_${account}`) ? localStorage.getItem(`my_invest_tx_${account}`) : '{}',
    )

    if (myInvestTxns[rebalanceAddress]) {
      myInvestTxns[rebalanceAddress].push(transactionHash)
    } else {
      myInvestTxns[rebalanceAddress] = [transactionHash]
    }

    localStorage.setItem(`my_invest_tx_${account}`, JSON.stringify(myInvestTxns))
  }

  const onWithdraw = async () => {
    const rebalanceContract = getCustomContract(
      klaytn as provider,
      rebalanceAbi as unknown as AbiItem,
      getAddress(rebalance.address),
    )
    setIsWithdrawing(true)
    try {
      const thisInput = currentBalance.isLessThan(new BigNumber(currentInput))
        ? currentBalance
        : new BigNumber(currentInput)
      const usdToken = get(rebalance, 'usdToken.0', {})

      const lpAmount = thisInput.times(new BigNumber(10).pow(18)).toJSON()
      const outputRatios = (rebalance?.tokens || []).map((token, index) => {
        const tokenAddress = typeof token.address === 'string' ? token.address : getAddress(token.address)
        return selectedToken[tokenAddress]
          ? (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
          : 0
      })
      const outputUSDRatio = selectedToken[
        typeof usdToken.address === 'string' ? usdToken.address : getAddress(usdToken.address)
      ]
        ? (((rebalance || {}).usdTokenRatioPoint || [])[0] || new BigNumber(0)).toNumber()
        : 0

      if (isKlipConnector(connector)) {
        klipProvider.genQRcodeContactInteract(
          getAddress(rebalance.address),
          JSON.stringify(getAbiRebalanceByName('removeFund')),
          JSON.stringify([lpAmount, toAllAssets, outputRatios, outputUSDRatio]),
          setShowModal,
        )
        const tx = await klipProvider.checkResponse()
        setTx(tx)
        handleLocalStorage(tx)
      } else {
        const estimatedGas = await getEstimateGas(rebalanceContract.methods.removeFund, account, lpAmount, toAllAssets, outputRatios, outputUSDRatio)
        const tx = await rebalanceContract.methods
          .removeFund(lpAmount, toAllAssets, outputRatios, outputUSDRatio)
          .send({ from: account, gas: estimatedGas })
        setTx(tx)
        handleLocalStorage(tx)
      }
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      toastSuccess(t('{{Action}} Complete', { Action: t('actionWithdraw') }))
      onNext()
      onDismiss()
      setIsWithdrawing(false)
    } catch (e) {
      toastError(t('{{Action}} Failed', { Action: t('actionWithdraw') }))
      setIsWithdrawing(false)
    }
  }
  return (
    <Modal title={t('Confirm Withdraw')} mobileFull onDismiss={onDismiss}>
      <ModalBody isBody>
        <CardHeading rebalance={rebalance} isHorizontal={isMobile} onlyTitle xspacing="S_24" />
        <Text color="text" textStyle="R_16M" mt="S_40" mb="S_12">
          {t('Withdrawal Amount')}
        </Text>
        <Box p="S_24" pt="S_12" className="bd" borderRadius="8px" width="438px" maxWidth="100%">
          {tokenList.map((c) => (
            <InlineAssetRatioLabel small key={c.symbol} coin={c} column={isMobile} />
          ))}
          <Divider mt="S_12" mb="S_20" />
          <Flex color="text" alignItems="center" mb="S_16" flexWrap="wrap">
            <Text textStyle="R_16M" className="flex-auto" pr="S_24">
              {t('Total Withdraw')}
            </Text>
            <Text color="black" textStyle="R_18B" ml="auto">
              {currentInput}
              <Text textStyle="R_14R" ml="S_4" as="span">
                {t('SHR')}
              </Text>
            </Text>
          </Flex>
          <Flex flexDirection="column" color="textSubtle" textStyle="R_14R">
            <SpaceBetweenFormat title={t('Estimated Value')} value={estimatedValue} />
          </Flex>
        </Box>
      </ModalBody>
      <ModalFooter isFooter>
        <Button mt="S_16" width="100%" isLoading={isSimulating || isWithdrawing} onClick={onWithdraw}>
          {t('Withdraw')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default WithdrawCalculateModal
