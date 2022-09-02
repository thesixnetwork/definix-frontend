import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import numeral from 'numeral'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'uikitV2/components/Card'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'
import { getAddress } from 'utils/addressHelpers'
import { useBalances, usePriceFinixUsd, useRebalanceBalances } from '../../../state/hooks'
import { Rebalance } from '../../../state/types'
import AssetRatio from './AssetRatio'
import CardHeading from './CardHeading'
import Harvest from './Harvest'
import MiniChart from './MiniChart'
import RebalanceSash from './RebalanceSash'

interface ExploreCardType {
  isHorizontal: boolean
  rebalance: Rebalance | any
  balance: BigNumber
  pendingReward: BigNumber
  onClickViewDetail: () => void
}

const SharePrice = ({ rebalance, className = '' }) => {
  return (
    <TwoLineFormatV2
      title="Share Price (Since Inception)"
      className={className}
      value={`$${numeral(_.get(rebalance, 'sharedPrice', 0)).format('0,0.00')}`}
      percent={`${
        rebalance.sharedPricePercentDiff >= 0
          ? `+${numeral(_.get(rebalance, 'sharedPricePercentDiff', 0)).format('0,0.[00]')}`
          : `${numeral(_.get(rebalance, 'sharedPricePercentDiff', 0)).format('0,0.[00]')}`
      }%`}
      percentColor={(() => {
        if (_.get(rebalance, 'sharedPricePercentDiff', 0) < 0) return 'error.main'
        if (_.get(rebalance, 'sharedPricePercentDiff', 0) > 0) return 'success.main'
        return ''
      })()}
    />
  )
}

const TotalAssetValue = ({ rebalance, className = '' }) => {
  return (
    <TwoLineFormatV2
      title="Total Asset Value"
      value={`$${numeral(_.get(rebalance, 'totalAssetValue', 0)).format('0,0.[00]')}`}
      className={className}
    />
  )
}

const YieldAPR = ({ rebalance, className = '' }) => {
  const finixPrice = usePriceFinixUsd()

  return (
    <TwoLineFormatV2
      title="Yield APR"
      value={`${numeral(
        finixPrice
          .times(_.get(rebalance, 'finixRewardPerYearFromApollo', new BigNumber(0)))
          .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
          .times(100)
          .toFixed(2),
      ).format('0,0.[00]')}%`}
      tooltip="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
      className={className}
    />
  )
}

const CurrentInvestment = ({ balance, percentage, diffAmount, rebalance, className = '' }) => {
  return (
    <TwoLineFormatV2
      title="Current Investment"
      className={className}
      value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
      percent={`(${
        percentage > 0 ? `+${numeral(percentage).format('0,0.[00]')}` : `${numeral(percentage).format('0,0.[00]')}`
      }%)`}
      diffAmounts={`${
        percentage > 0 ? `+${numeral(diffAmount).format('0,0.[000]')}` : `${numeral(diffAmount).format('0,0.[000]')}`
      }`}
      percentColor={(() => {
        if (percentage < 0) return 'error.main'
        if (percentage > 0) return 'success.main'
        return ''
      })()}
    />
  )
}

const ExploreCard: React.FC<ExploreCardType> = ({ balance, rebalance = {}, onClickViewDetail, pendingReward }) => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const { ratio } = rebalance
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  const thisBalance = rebalance.enableAutoCompound ? rebalanceBalances : balances
  const currentBalance = _.get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  const api = process.env.REACT_APP_DEFINIX_TOTAL_TXN_AMOUNT_API

  const [diffAmount, setDiffAmount] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const sharedprice = +(currentBalanceNumber * rebalance.sharedPrice)

  const combinedAmount = useCallback(async () => {
    if (account) {
      const rebalanceAddress = getAddress(_.get(rebalance, 'address'))

      const myInvestTxnLocalStorage = JSON.parse(
        localStorage.getItem(`my_invest_tx_${account}`) ? localStorage.getItem(`my_invest_tx_${account}`) : '{}',
      )

      const myInvestTxns = myInvestTxnLocalStorage[rebalanceAddress] ? myInvestTxnLocalStorage[rebalanceAddress] : []
      const resTotalTxn = await axios.get(`${api}/total_txn_amount?pool=${rebalanceAddress}&address=${account}`)

      const latestTxns = _.get(resTotalTxn.data, 'latest_txn')
      const totalUsds = _.get(resTotalTxn.data, 'total_usd_amount')
      const totalLps = _.get(resTotalTxn.data, 'total_lp_amount')

      const indexTx = _.findIndex(myInvestTxns, (investTxs) => investTxs === latestTxns)
      const transactionsSlice = myInvestTxns.slice(indexTx + 1)
      myInvestTxnLocalStorage[rebalanceAddress] = transactionsSlice
      localStorage.setItem(`my_invest_tx_${account}`, JSON.stringify(myInvestTxnLocalStorage))

      const txHash = {
        txns: transactionsSlice,
      }
      let lastTotalAmt = 0
      let lastTotalLp = 0
      if (transactionsSlice.length > 0) {
        const datas = (await axios.post(`${api}/txns_usd_amount`, txHash)).data
        lastTotalAmt = _.get(datas, 'total_usd_amount')
        lastTotalLp = _.get(datas, 'total_lp_amount')
      }

      const totalUsd = totalUsds
      const totalLpAmount = totalLps + lastTotalLp

      if (sharedprice > 0 && totalUsd > 0 && totalLpAmount > 0) {
        const totalUsdAmount = lastTotalAmt + totalUsd
        const diff = sharedprice - totalUsdAmount
        setDiffAmount(diff)
        const diffNewAmount = ((sharedprice - totalUsdAmount) / totalUsdAmount) * 100
        setPercentage(diffNewAmount)
      }
    }
  }, [sharedprice, rebalance, account, api])

  useEffect(() => {
    combinedAmount()
  }, [combinedAmount])

  const allCurrentTokens = _.compact([...((rebalance || {}).tokens || [])])

  return (
    <Card className="mb-3">
      {rebalance.rebalance && <RebalanceSash title={rebalance.rebalance} />}

      <CardHeading rebalance={rebalance} />

      <Box display="flex" flexWrap="wrap" py={{ xs: 2.5, lg: 4 }}>
        <Box
          sx={{ width: { xs: '100%', lg: '45%' } }}
          px={{ xs: 2.5, lg: 4 }}
          pb={{ xs: 2.5, lg: 0 }}
          mb={{ xs: 2.5, lg: 0 }}
          className={lgUp ? 'bd-r' : 'bd-b'}
        >
          <Box display="flex">
            <TotalAssetValue rebalance={rebalance} className="col-6 mb-3" />
            <YieldAPR rebalance={rebalance} className="col-6 mb-3" />
          </Box>

          {!lgUp && <SharePrice rebalance={rebalance} className="mb-3" />}

          <AssetRatio ratio={ratio} />
        </Box>

        {lgUp && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            sx={{ width: '27.5%' }}
            className="bd-r"
            px={4}
          >
            <SharePrice rebalance={rebalance} className="mb-3" />
            <MiniChart tokens={allCurrentTokens} rebalanceAddress={getAddress(rebalance.address)} height={48} />
          </Box>
        )}

        <Box sx={{ width: { xs: '100%', lg: '27.5%' } }} px={{ xs: 2.5, lg: 4 }}>
          <Harvest value={pendingReward} rebalance={rebalance} large />
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: '12px' }}>
            <CurrentInvestment
              balance={balance}
              percentage={percentage}
              diffAmount={diffAmount}
              rebalance={rebalance}
            />
            <Button
              variant="contained"
              size="large"
              color="info"
              component={Link}
              to="/rebalancing/detail"
              onClick={onClickViewDetail}
              sx={{ width: '120px', px: 1, fontSize: '0.875rem' }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default ExploreCard
