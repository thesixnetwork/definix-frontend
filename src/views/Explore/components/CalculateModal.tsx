import React from 'react'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { useDispatch } from 'react-redux'
import { get } from 'lodash'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { useTranslation } from 'react-i18next'
import rebalanceAbi from 'config/abi/rebalance.json'
import { Box, Button, Text, Modal, useMatchBreakpoints, Flex } from 'definixswap-uikit'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import * as klipProvider from 'hooks/klipProvider'
import { getAbiRebalanceByName } from 'hooks/hookHelper'
import { getCustomContract } from 'utils/erc20'
import { getAddress } from 'utils/addressHelpers'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances } from '../../../state/wallet'
import { fetchRebalances } from '../../../state/rebalance'
// import { useSlippage } from '../../../state/hooks'
import SpaceBetweenFormat from './SpaceBetweenFormat'
import CardHeading from './CardHeading'
import VerticalAssetRatio from './VerticalAssetRatio'
import PriceUpdate from './PriceUpdate'
// import Share from './Share'

const CardCalculate = ({
  setTx,
  currentInput,
  isInvesting,
  setIsInvesting,
  isSimulating,
  recalculate,
  poolUSDBalances,
  poolAmounts,
  onNext,
  rebalance,
  sumPoolAmount,
  calNewImpact,
}) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  // const slippage = useSlippage()
  const { setShowModal } = React.useContext(KlipModalContext())
  const { account, klaytn, connector } = useWallet()
  const dispatch = useDispatch()
  // const balances = useBalances(account)
  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // @ts-ignore
  const totalUsdPool = new BigNumber([rebalance.sumCurrentPoolUsdBalance])
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  const totalUserUsdAmount = new BigNumber(get(poolUSDBalances, 1, '0'))
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  // const minUserUsdAmount = totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))

  // @ts-ignore
  const totalSupply = new BigNumber([rebalance.totalSupply[0]]).div(new BigNumber(10).pow(18)).toNumber()
  const currentShare = (totalUserUsdAmount / totalUsdPool) * totalSupply
  // const priceImpact = Math.round((totalUserUsdAmount / totalUsdPool) * 10) / 10

  // const calNewImpact = Math.abs(((totalUserUsdAmount - sumPoolAmount) / sumPoolAmount) * 100)

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
      onNext()
      setIsInvesting(false)
    } catch {
      setIsInvesting(false)
    }
  }

  return (
    <>
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
            {currentShare <= 0 || Number.isNaN(currentShare)
              ? numeral(sumPoolAmount).format('0,0.[00]')
              : numeral(currentShare).format('0,0.[00]')}
          </Text>
          <Text textStyle="R_14R" className="ml-s4">
            Shares
          </Text>
          {false && <PriceUpdate className="mt-3" onClick={recalculate} />}
        </Flex>
        <Flex flexDirection="column">
          <SpaceBetweenFormat
            className="mb-2"
            title={t('Estimated Value')}
            value={numeral(sumPoolAmount).format('0,0.[00]')}
          />
          <SpaceBetweenFormat
            className="mb-2"
            title={t('Price Impact')}
            // value={`${calNewImpact <= 0.1 ? '< 0.1' : calNewImpact}%`}
            value={`${calNewImpact <= 0.1 ? '< ' : ''} ${numeral(calNewImpact).format('0,0.[00]')}%`}
          />

          {/* <Share
            share={
              currentShare <= 0 || Number.isNaN(currentShare)
                ? numeral(sumPoolAmount).format('0,0.[00]')
                : numeral(currentShare).format('0,0.[00]')
            }
            usd={`~${numeral(sumPoolAmount).format('0,0.[00]')}`}
            textAlign={isMobile ? 'center' : 'left'}
          /> */}
          {/* <Text fontSize="12px" textAlign={isMobile ? 'center' : 'left'}>
            Output is estimated. You will receive at least{' '}
            <strong>{numeral(sumPoolAmount - sumPoolAmount / (100 / (slippage / 100))).format('0,0.[00]')} USD</strong> or
            the transaction will revert.
          </Text> */}
          {/*
            <SpaceBetweenFormat
              className="mb-2"
              title={t('Minimum Received')}
              value={`${numeral(currentShare).format('0,0.[00]')} SHARE`}
            />
            <SpaceBetweenFormat className="mb-2" title="Liquidity Provider Fee" value="0.003996 SIX" />
           */}
        </Flex>
      </Box>
      <Button className="mt-s40" width="100%" disabled={isInvesting || isSimulating} onClick={onInvest}>
        {t('Invest')}
      </Button>
    </>
  )
}

const CalculateModal = ({
  setTx,
  currentInput,
  isInvesting,
  setIsInvesting,
  isSimulating,
  recalculate,
  poolUSDBalances,
  poolAmounts,
  onNext,
  rebalance,
  sumPoolAmount,
  calNewImpact,
  onDismiss = () => null,
}) => {
  const { t } = useTranslation()
  return (
    <Modal title={t('Confirm Invest')} mobileFull onDismiss={onDismiss}>
      <CardCalculate
        setTx={setTx}
        currentInput={currentInput}
        isInvesting={isInvesting}
        setIsInvesting={setIsInvesting}
        isSimulating={isSimulating}
        recalculate={recalculate}
        poolUSDBalances={poolUSDBalances}
        poolAmounts={poolAmounts}
        rebalance={rebalance}
        sumPoolAmount={sumPoolAmount}
        onNext={onNext}
        calNewImpact={calNewImpact}
      />
    </Modal>
  )
}

export default CalculateModal
