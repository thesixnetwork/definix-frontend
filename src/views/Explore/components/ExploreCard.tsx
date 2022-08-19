import { useWallet } from '@binance-chain/bsc-use-wallet'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import numeral from 'numeral'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, useMatchBreakpoints } from 'uikit-dev'
import Card from 'uikitV2/components/Card'
import { getAddress } from 'utils/addressHelpers'
import { useBalances, usePriceFinixUsd, useRebalanceBalances } from '../../../state/hooks'
import { Rebalance } from '../../../state/types'
import AssetRatio from './AssetRatio'
import CardHeading from './CardHeading'
import Harvest from './Harvest'
import MiniChart from './MiniChart'
import RebalanceSash from './RebalanceSash'
import TwoLineFormat from './TwoLineFormat'

interface ExploreCardType {
  isHorizontal: boolean
  rebalance: Rebalance | any
  balance: BigNumber
  pendingReward: BigNumber
  onClickViewDetail: () => void
}

const SharePrice = ({ rebalance, className = '' }) => {
  return (
    <TwoLineFormat
      title="Share price"
      subTitle="(Since inception)"
      subTitleFontSize="11px"
      className={className}
      value={`$${numeral(_.get(rebalance, 'sharedPrice', 0)).format('0,0.00')}`}
      percent={`${
        rebalance.sharedPricePercentDiff >= 0
          ? `+${numeral(_.get(rebalance, 'sharedPricePercentDiff', 0)).format('0,0.[00]')}`
          : `${numeral(_.get(rebalance, 'sharedPricePercentDiff', 0)).format('0,0.[00]')}`
      }%`}
      percentClass={(() => {
        if (_.get(rebalance, 'sharedPricePercentDiff', 0) < 0) return 'failure'
        if (_.get(rebalance, 'sharedPricePercentDiff', 0) > 0) return 'success'
        return ''
      })()}
    />
  )
}

const TotalAssetValue = ({ rebalance, className = '' }) => {
  return (
    <TwoLineFormat
      title="Total asset value"
      value={`$${numeral(_.get(rebalance, 'totalAssetValue', 0)).format('0,0.[00]')}`}
      className={className}
    />
  )
}

const YieldAPR = ({ rebalance, className = '' }) => {
  const finixPrice = usePriceFinixUsd()

  return (
    <TwoLineFormat
      title="Yield APR"
      className={className}
      value={`${numeral(
        finixPrice
          .times(_.get(rebalance, 'finixRewardPerYearFromApollo', new BigNumber(0)))
          .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
          .times(100)
          .toFixed(2),
      ).format('0,0.[00]')}%`}
      hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
    />
  )
}

const CurrentInvestment = ({ balance, percentage, diffAmount, rebalance, className = '' }) => {
  return (
    <TwoLineFormat
      title="Current investment"
      className={className}
      value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
      currentInvestPercentDiff={`(${
        percentage > 0 ? `+${numeral(percentage).format('0,0.[00]')}` : `${numeral(percentage).format('0,0.[00]')}`
      }%)`}
      diffAmounts={`${
        percentage > 0 ? `+${numeral(diffAmount).format('0,0.[000]')}` : `${numeral(diffAmount).format('0,0.[000]')}`
      }`}
      percentClass={(() => {
        if (percentage < 0) return 'failure'
        if (percentage > 0) return 'success'
        return ''
      })()}
    />
  )
}

const ExploreCard: React.FC<ExploreCardType> = ({ balance, rebalance = {}, onClickViewDetail, pendingReward }) => {
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { ratio } = rebalance

  useEffect(() => {
    return () => {
      setIsOpenAccordion(false)
    }
  }, [])

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
    <Card className="flex align-strench mb-3">
      {rebalance.rebalance && <RebalanceSash title={rebalance.rebalance} />}

      <CardHeading rebalance={rebalance} className="col-3 pr-3 bd-r" />

      <div className="col-9 flex">
        <div className="col-6 flex flex-column justify-space-between px-3 bd-r">
          <div className="flex mb-2">
            <SharePrice rebalance={rebalance} className="col-6" />

            <div className="col-6 pl-2">
              <MiniChart tokens={allCurrentTokens} rebalanceAddress={getAddress(rebalance.address)} height={50} />
            </div>
          </div>

          <AssetRatio ratio={ratio} className="mb-2" />

          <div className="flex justify-space-between">
            <TotalAssetValue rebalance={rebalance} className="col-5" />
            <YieldAPR rebalance={rebalance} className="col-5" />
          </div>
        </div>

        <div className="col-6 pl-3">
          <Harvest value={pendingReward} rebalance={rebalance} large />

          <div className="flex align-center">
            <CurrentInvestment
              balance={balance}
              percentage={percentage}
              diffAmount={diffAmount}
              rebalance={rebalance}
              className="col-6"
            />

            <div className="col-6 pl-2">
              <Button fullWidth radii="small" as={Link} to="/rebalancing/detail" onClick={onClickViewDetail}>
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ExploreCard
