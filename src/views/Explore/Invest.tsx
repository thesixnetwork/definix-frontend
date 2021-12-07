/* eslint-disable no-nested-ternary */
import BigNumber from 'bignumber.js'
import React, { useRef, useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { get, isEqual, compact } from 'lodash'

import { BackIcon, Box, Button, Flex, Text, useMatchBreakpoints, useModal } from 'definixswap-uikit'

import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { getAddress } from 'utils/addressHelpers'
import { useDispatch } from 'react-redux'
import PageTitle from 'components/PageTitle'
import { Rebalance } from '../../state/types'
import { useBalances, useAllowances } from '../../state/hooks'
import { fetchAllowances, fetchBalances } from '../../state/wallet'
import { simulateInvest, getReserves } from '../../offline-pool'
import CalculateModal from './components/CalculateModal'
import InvestInputCard from './components/InvestInputCard'
import SummaryCard, { SummaryItem } from './components/SummaryCard'

interface InvestType {
  rebalance: Rebalance | any
}

const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const Invest: React.FC<InvestType> = ({ rebalance }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { isMaxSm } = useMatchBreakpoints()
  const isMobile = isMaxSm
  const [tx, setTx] = useState({})
  const [poolUSDBalancesState, setPoolUSDBalances] = useState([])
  const [poolAmounts, setPoolAmounts] = useState([])
  const [sumPoolAmount, setSumPoolAmount] = useState(0)
  const [isSimulating, setIsSimulating] = useState(true)
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({})
  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const allowances = useAllowances(account, getAddress(get(rebalance, 'address', {})))
  const prevRebalance = usePrevious(rebalance, {})
  const prevBalances = usePrevious(balances, {})
  const prevCurrentInput = usePrevious(currentInput, {})
  const [calNewImpact, setCalNewImpact] = useState(0)

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
    }
  }, [dispatch, account, rebalance])

  useEffect(() => {
    return () => {
      setTx({})
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (
      !isEqual(rebalance, prevRebalance) ||
      !isEqual(balances, prevBalances) ||
      !isEqual(currentInput, prevCurrentInput)
    ) {
      setIsSimulating(true)
      // eslint-disable-next-line
      const [__, poolAmountsData] = await simulateInvest(
        compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
          const ratioPoint = (
            ((rebalance || {}).tokenRatioPoints || [])[index] ||
            ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
            new BigNumber(0)
          ).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber((currentInput[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
      )

      const poolUSDBalancesDataProcess = getReserves(
        compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
          const ratioPoint = (
            ((rebalance || {}).tokenRatioPoints || [])[index] ||
            ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
            new BigNumber(0)
          ).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber((currentInput[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
      )

      const reservePoolAmountProcess = getReserves(
        compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
          const ratioPoint = (
            ((rebalance || {}).tokenRatioPoints || [])[index] ||
            ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
            new BigNumber(0)
          ).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber((poolAmountsData[index] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
      )
      let sumUsd = new BigNumber(0)

      const [poolUSDBalancesData, reservePoolAmount] = await Promise.all([
        poolUSDBalancesDataProcess,
        reservePoolAmountProcess,
      ])
      // Promise.all([poolUSDBalancesDataProcess, reservePoolAmountProcess]).then(data => {
      // const [poolUSDBalancesData,reservePoolAmount]  = data
      // @ts-ignore
      for (let i = 0; i < reservePoolAmount[0]?.length || 0; i++) {
        const decimal = rebalance.tokens[i]?.decimals ? rebalance.tokens[i].decimals : 6
        sumUsd = sumUsd.plus(reservePoolAmount[0][i].dividedBy(10 ** (decimal + 6)))
      }
      const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
      // @ts-ignore
      const totalUserUsdAmount = new BigNumber(get(poolUSDBalancesData, 1, '0'))
        .div(new BigNumber(10).pow(usdToken.decimals || 18))
        .toNumber()
      const calNewImpactPrice = Math.abs(((totalUserUsdAmount - +sumUsd.toFixed()) / +sumUsd.toFixed()) * 100)

      setCalNewImpact(calNewImpactPrice)
      setPoolUSDBalances(poolUSDBalancesData)
      setSumPoolAmount(+sumUsd.toFixed())
      setPoolAmounts(poolAmountsData)
      setIsSimulating(false)
      // })
    }
  }, [balances, currentInput, rebalance, prevRebalance, prevBalances, prevCurrentInput])

  // const calReserve = useCallback(async () => {
  //   if (
  //     !isEqual(rebalance, prevRebalance) ||
  //     !isEqual(balances, prevBalances) ||
  //     !isEqual(currentInput, prevCurrentInput)
  //   ) {
  //     setIsSimulating(false)

  //     const poolUSDBalancesData = await getReserves(
  //       compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
  //         const ratioPoint = (
  //           ((rebalance || {}).tokenRatioPoints || [])[index] ||
  //           ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
  //           new BigNumber(0)
  //         ).toNumber()
  //         const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
  //         const decimal = c.decimals
  //         return {
  //           ...c,
  //           symbol: c.symbol,
  //           address: ratioObject.address,
  //           ratioPoint,
  //           value: new BigNumber((currentInput[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
  //           balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
  //         }
  //       }),
  //     )
  //     const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  //     const totalUserUsdAmount = new BigNumber(get(poolUSDBalances, 1, '0'))
  //       .div(new BigNumber(10).pow(usdToken.decimals || 18))
  //       .toNumber()
  //     console.log("diff", totalUserUsdAmount, sumPoolAmount)
  //     const calNewImpactPrice = Math.abs(((totalUserUsdAmount - sumPoolAmount) / sumPoolAmount) * 100)
  //     setCalNewImpact(calNewImpactPrice)
  //     setPoolUSDBalances(poolUSDBalancesData)
  //     setIsSimulating(true)
  //   }
  // }, [balances, currentInput, rebalance, prevRebalance, prevBalances, prevCurrentInput, poolUSDBalances, sumPoolAmount])

  // const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // const totalUSDAmount = new BigNumber(get(poolUSDBalances, 1, '0'))
  //   .div(new BigNumber(10).pow(usdToken.decimals || 18))
  //   .toNumber()

  const [onPresentCalcModal] = useModal(
    <CalculateModal
      setTx={setTx}
      currentInput={currentInput}
      isSimulating={isSimulating}
      // recalculate={fetchData}
      poolUSDBalances={poolUSDBalancesState}
      poolAmounts={poolAmounts}
      rebalance={rebalance}
      sumPoolAmount={sumPoolAmount}
      onNext={() => {
        fetchData()
        history.goBack()
      }}
      calNewImpact={calNewImpact}
    />,
    false,
  )

  useEffect(() => {
    fetchData()
    // calReserve()
  }, [fetchData])

  if (!rebalance) return <Redirect to="/rebalancing" />

  return (
    <Box maxWidth="630px" mx="auto">
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <Flex className="mb-s20">
        <Button
          variant="text"
          as={Link}
          to="/rebalancing/detail"
          height="24px"
          p="0"
          startIcon={<BackIcon color="textSubtle" />}
        >
          <Text textStyle="R_16R" color="textSubtle">
            {t('Back')}
          </Text>
        </Button>
      </Flex>
      <PageTitle text={t('Invest')} small={isMobile} />

      <SummaryCard
        rebalance={rebalance}
        isMobile={isMobile}
        typeB
        items={[SummaryItem.YIELD_APR, SummaryItem.SHARE_PRICE_W_YIELD, SummaryItem.RISK_O_METER]}
      />

      <InvestInputCard
        isMobile={isMobile}
        rebalance={rebalance}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        balances={balances}
        allowances={allowances}
        onNext={() => {
          onPresentCalcModal()
        }}
        // totalUSDAmount={totalUSDAmount}
        isSimulating={isSimulating}
        sumPoolAmount={sumPoolAmount}
      />
    </Box>
  )
}

export default Invest
