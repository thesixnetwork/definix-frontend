/* eslint-disable no-nested-ternary */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import numeral from 'numeral'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import { useModal } from 'uikit-dev'
import BackV2 from 'uikitV2/components/BackV2'
import Card from 'uikitV2/components/Card'
import PageTitle from 'uikitV2/components/PageTitle'
import SmallestLayout from 'uikitV2/components/SmallestLayout'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'
import { getAddress } from 'utils/addressHelpers'
import { simulateInvest } from '../../offline-pool'
import { useAllowances, useBalances, usePriceFinixUsd } from '../../state/hooks'
import { Rebalance } from '../../state/types'
import { fetchAllowances, fetchBalances } from '../../state/wallet'
import CardHeading from './components/CardHeading'
import InvestConfirmModal from './components/InvestConfirmModal'
import InvestInputCard from './components/InvestInputCard'

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
  const [poolUSDBalances, setPoolUSDBalances] = useState([])
  const [poolAmounts, setPoolAmounts] = useState([])
  const [isSimulating, setIsSimulating] = useState(true)
  const [isInvesting, setIsInvesting] = useState(false)
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({})
  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const allowances = useAllowances(account, getAddress(_.get(rebalance, 'address', {})))
  const prevRebalance = usePrevious(rebalance, {})
  const prevBalances = usePrevious(balances, {})
  const prevCurrentInput = usePrevious(currentInput, {})
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'))
  const finixPrice = usePriceFinixUsd()
  const history = useHistory()

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address).toLowerCase())
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address).toLowerCase()]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address).toLowerCase()))
    }
  }, [dispatch, account, rebalance])
  const fetchData = useCallback(async () => {
    if (
      !_.isEqual(rebalance, prevRebalance) ||
      !_.isEqual(balances, prevBalances) ||
      !_.isEqual(currentInput, prevCurrentInput)
    ) {
      setIsSimulating(true)
      const [poolUSDBalancesData, poolAmountsData] = await simulateInvest(
        _.compact([...((rebalance || {}).tokens || [])]).map((c, index) => {
          const ratioPoint = (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber((currentInput[c.address.toLowerCase()] || '0') as string).times(
              new BigNumber(10).pow(decimal),
            ),
            balance:
              _.get(balances, c.address.toLowerCase(), new BigNumber(0)).times(new BigNumber(10).pow(decimal)) ||
              _.get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
            router: rebalance.router[index],
            factory: rebalance.factory[index],
            initCodeHash: rebalance.initCodeHash[index],
          }
        }),
      )
      setPoolUSDBalances(poolUSDBalancesData)
      setPoolAmounts(poolAmountsData)
      setIsSimulating(false)
    }
  }, [balances, currentInput, rebalance, prevRebalance, prevBalances, prevCurrentInput])

  const [onPresentConfirmModal] = useModal(
    <InvestConfirmModal
      currentInput={currentInput}
      isInvesting={isInvesting}
      setIsInvesting={setIsInvesting}
      isSimulating={isSimulating}
      recalculate={fetchData}
      poolUSDBalances={poolUSDBalances}
      poolAmounts={poolAmounts}
      rebalance={rebalance}
      onNext={() => {
        history.goBack()
      }}
    />,
    false,
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!rebalance) return <Redirect to="/rebalancing" />

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  const totalUSDAmount = new BigNumber(_.get(poolUSDBalances, 1, '0'))
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  return (
    <SmallestLayout>
      <BackV2 to="/rebalancing/detail" />
      <PageTitle title="Invest" caption="Invest in auto rebalancing products." sx={{ mb: 2.5 }} />

      <Card className="mb-3" sx={{ p: { xs: 2.5, sm: 5 } }}>
        <CardHeading
          rebalance={rebalance}
          hideDescription
          large
          className="pa-0"
          breakpoint={theme.breakpoints.values.sm}
        />
        <Box display="flex" flexWrap="wrap" pt={{ xs: 2.5, sm: 3 }}>
          <Box pr={{ sm: 3 }} className={smUp ? 'bd-r' : 'col-6 mb-3'}>
            <TwoLineFormatV2
              large
              title="Yield APR"
              value={numeral(
                finixPrice
                  .times(_.get(rebalance, 'finixRewardPerYearFromApollo', new BigNumber(0)))
                  .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
                  .times(100)
                  .toFixed(2),
              ).format('0,0.[00]')}
              tooltip="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
            />
          </Box>
          <Box px={{ sm: 3 }} className={smUp ? 'bd-r' : 'col-6'}>
            <TwoLineFormatV2
              large
              title="Share Price (Since inception)"
              value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
              percent={`${
                rebalance.sharedPricePercentDiff >= 0
                  ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                  : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
              }%`}
              percentColor={(() => {
                if (rebalance.sharedPricePercentDiff < 0) return 'error.main'
                if (rebalance.sharedPricePercentDiff > 0) return 'success.main'
                return ''
              })()}
            />
          </Box>
          <Box px={{ sm: 3 }} className={smUp ? '' : 'col-6'}>
            <TwoLineFormatV2 large title="Risk-O-Meter" value="Medium" />
          </Box>
        </Box>
      </Card>

      <InvestInputCard
        rebalance={rebalance}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        balances={balances}
        allowances={allowances}
        onNext={onPresentConfirmModal}
        totalUSDAmount={totalUSDAmount}
        isSimulating={isSimulating}
      />
    </SmallestLayout>
  )
}

export default Invest
