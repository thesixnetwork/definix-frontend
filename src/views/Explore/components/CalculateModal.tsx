import React, { useState } from 'react'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { useDispatch } from 'react-redux'
import { get } from 'lodash'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { useTranslation } from 'react-i18next'
import rebalanceAbi from 'config/abi/rebalance.json'
import { Box, Button, Text, Modal, useMatchBreakpoints, Flex, Noti, NotiType, ModalFooter, ModalBody } from 'definixswap-uikit-v2'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import * as klipProvider from 'hooks/klipProvider'
import { getAbiRebalanceByName } from 'hooks/hookHelper'
import { getCustomContract } from 'utils/erc20'
import { getAddress } from 'utils/addressHelpers'
import { useToast } from 'state/hooks'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances } from '../../../state/wallet'
import { fetchRebalances } from '../../../state/rebalance'
// import { useSlippage } from '../../../state/hooks'
import SpaceBetweenFormat from './SpaceBetweenFormat'
import CardHeading from './CardHeading'
import VerticalAssetRatio from './VerticalAssetRatio'

const CalculateModal = ({
  setTx,
  currentInput,
  poolAmounts,
  rebalance,
  sumPoolAmount,
  calNewImpact,
  shares,
  onNext,
  onDismiss = () => null,
}) => {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const { toastSuccess, toastError } = useToast()

  const [isInvesting, setIsInvesting] = useState(false)
  const isMobile = !isXl && !isXxl
  // const slippage = useSlippage()
  const { setShowModal } = React.useContext(KlipModalContext())
  const { account, klaytn, connector } = useWallet()
  const dispatch = useDispatch()
  // const balances = useBalances(account)
  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}

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
  const onInvest = async () => {
    const rebalanceContract = getCustomContract(
      klaytn as provider,
      rebalanceAbi as unknown as AbiItem,
      getAddress(rebalance.address),
    )
    setIsInvesting(true)
    try {
      let containMainCoin = false
      let mainCoinValue = '0'
      const arrayTokenAmount = ((rebalance || {}).tokens || []).map((token) => {
        if (token.symbol === 'WKLAY' || token.symbol === 'WBNB') {
          containMainCoin = true
          mainCoinValue = new BigNumber((currentInput[token.address] || '0') as string)
            .times(new BigNumber(10).pow(token.decimals))
            .toJSON()
        }
        return new BigNumber((currentInput[token.address] || '0') as string)
          .times(new BigNumber(10).pow(token.decimals))
          .toJSON()
      })

      const usdTokenAmount = new BigNumber((currentInput[usdToken.address] || '0') as string)
        .times(new BigNumber(10).pow(usdToken.decimals))
        .toJSON()
      // const minUsdAmount = new BigNumber(minUserUsdAmount).times(new BigNumber(10).pow(usdToken.decimals)).toJSON()
      if (connector === 'klip') {
        const valueNumber = (Number(mainCoinValue) / 10 ** 18).toString()
        const valueklip = Number.parseFloat(valueNumber).toFixed(6)
        let expectValue = `${(Number(valueklip) + 0.00001) * 10 ** 18}`
        expectValue = expectValue.slice(0, -13)
        const valueKlipParam = mainCoinValue !== '0' ? `${expectValue}0000000000000` : '0'

        klipProvider.genQRcodeContactInteract(
          getAddress(rebalance.address),
          JSON.stringify(getAbiRebalanceByName('addFund')),
          // JSON.stringify([arrayTokenAmount, usdTokenAmount, minUsdAmount]),
          JSON.stringify([arrayTokenAmount, usdTokenAmount, 0]),
          setShowModal,
          valueKlipParam,
        )

        const tx = {
          transactionHash: await klipProvider.checkResponse(),
        }
        setShowModal(false)
        setTx(tx)
        handleLocalStorage(tx)
      } else {
        const tx = await rebalanceContract.methods
          // .addFund(arrayTokenAmount, usdTokenAmount, minUsdAmount)
          .addFund(arrayTokenAmount, usdTokenAmount, 0)
          .send({ from: account, gas: 5000000, ...(containMainCoin ? { value: mainCoinValue } : {}) })
        setTx(tx)
        handleLocalStorage(tx)
      }
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      dispatch(fetchRebalances())
      toastSuccess(t('{{Action}} Complete', { Action: t('actionInvest') }))
      onNext()
      onDismiss()
      setIsInvesting(false)
    } catch (e) {
      console.error(e)
      toastError(t('{{Action}} Failed', { Action: t('actionInvest') }))
      setIsInvesting(false)
    }
  }
  return (
    <Modal title={t('Confirm Invest')} mobileFull onDismiss={onDismiss}>
      <ModalBody>
        <CardHeading
          rebalance={rebalance}
          isHorizontal={isMobile}
          onlyTitle
          className={`bd-b ${isMobile ? 'pb-s24' : 'pb-s32'}`}
        />

        <Text color="text" textStyle="R_16M" className="mt-s24 mb-s12">
          {t('Invest Asset Ratio')}
        </Text>
        <Box className="bd pa-s24 pt-s12" borderRadius="8px">
          <VerticalAssetRatio className="pb-s12 mb-s20 bd-b" rebalance={rebalance} poolAmounts={poolAmounts} />
          <Flex color="text" alignItems="center" justifyContent="flex-end" className="mb-s16">
            <Text textStyle="R_16M" className="flex-auto">
              {t('Total Invest')}
            </Text>
            <Text color="black" textStyle="R_18B" ml="auto">
              {shares}
            </Text>
            <Text textStyle="R_14R" className="ml-s4">
              {t('SHR')}
            </Text>
          </Flex>
          <Flex flexDirection="column" color="textSubtle" textStyle="R_14R">
            <SpaceBetweenFormat
              className="mb-2"
              title={t('Estimated Value')}
              value={numeral(sumPoolAmount).format('0,0.[00]')}
            />
            <SpaceBetweenFormat
              title={t('Price Impact')}
              value={`${calNewImpact <= 0.1 ? '< ' : ''} ${numeral(calNewImpact).format('0,0.[00]')}%`}
            />
          </Flex>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button className="mt-s40" width="100%" isLoading={isInvesting} onClick={onInvest}>
          {t('Invest')}
        </Button>
        {calNewImpact >= 0.05 && (
          <Noti mt="S_12" type={NotiType.ALERT}>
            {calNewImpact >= 0.15 ? t('Price Impact Too High') : t('This swap has a price impact of at least 10%')}
          </Noti>
        )}
      </ModalFooter>
    </Modal>
  )
}

export default CalculateModal
