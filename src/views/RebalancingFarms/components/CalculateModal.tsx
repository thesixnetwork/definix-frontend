import React, { useState } from 'react'
import numeral from 'numeral'
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
  Text,
  Modal,
  useMatchBreakpoints,
  Flex,
  Noti,
  NotiType,
  ModalFooter,
  ModalBody,
} from '@fingerlabs/definixswap-uikit-v2'
import { getAbiRebalanceByName } from 'hooks/hookHelper'
import { getCustomContract } from 'utils/erc20'
import { getAddress } from 'utils/addressHelpers'
import { useToast } from 'state/hooks'
import CurrencyText from 'components/Text/CurrencyText'
import useWallet from 'hooks/useWallet'
import useKlipContract from 'hooks/useKlipContract'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances } from '../../../state/wallet'
import { fetchRebalances } from '../../../state/rebalance'
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
  const { isKlip, request } = useKlipContract()
  const { account, klaytn } = useWallet()
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
      if (isKlip()) {
        const valueNumber = (Number(mainCoinValue) / 10 ** 18).toString()
        const valueklip = Number.parseFloat(valueNumber).toFixed(6)
        let expectValue = `${(Number(valueklip) + 0.00001) * 10 ** 18}`
        expectValue = expectValue.slice(0, -13)
        const valueKlipParam = mainCoinValue !== '0' ? `${expectValue}0000000000000` : '0'

        const tx = await request({
          contractAddress: getAddress(rebalance.address),
          abi: getAbiRebalanceByName('addFund'),
          // [arrayTokenAmount, usdTokenAmount, minUsdAmount],
          input: [arrayTokenAmount, usdTokenAmount, 0],
          value: valueKlipParam,
        })

        setTx(tx)
        handleLocalStorage(tx)
      } else {
        // const estimatedGas = await getEstimateGas(
        //   rebalanceContract.methods.addFund,
        //   account,
        //   arrayTokenAmount,
        //   usdTokenAmount,
        //   0,
        // )
        // console.log(await rebalanceContract.methods.addFund(arrayTokenAmount, usdTokenAmount, 0).estimateGas({ from: account }))
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
      <ModalBody isBody>
        <CardHeading rebalance={rebalance} isHorizontal={isMobile} onlyTitle xspacing="S_24" />
        <Text color="text" textStyle="R_16M" mt="S_40" mb="S_12">
          {t('Invest Asset Ratio')}
        </Text>
        <Box p="S_24" pt="S_12" className="bd" borderRadius="8px" width="438px" maxWidth="100%">
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
              valueElm={<CurrencyText value={sumPoolAmount} />}
            />
            <SpaceBetweenFormat
              title={t('Price Impact')}
              value={`${calNewImpact <= 0.1 ? '< ' : ''} ${numeral(calNewImpact).format('0,0.[00]')}%`}
            />
          </Flex>
        </Box>
      </ModalBody>
      <ModalFooter isFooter>
        <Button mt="S_16" width="100%" isLoading={isInvesting} onClick={onInvest}>
          {t('Invest')}
        </Button>
        {calNewImpact >= 5 && (
          <Noti mt="S_12" type={NotiType.ALERT}>
            {calNewImpact >= 15 ? t('Price Impact Too High') : t('This swap has a price impact of at least 10%')}
          </Noti>
        )}
      </ModalFooter>
    </Modal>
  )
}

export default CalculateModal
