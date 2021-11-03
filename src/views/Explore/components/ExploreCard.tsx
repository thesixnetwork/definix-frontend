import React, { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import axios from 'axios'
import { getAddress } from 'utils/addressHelpers'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card, CardBody, CardRibbon, useMatchBreakpoints } from 'definixswap-uikit'
import numeral from 'numeral'
import AssetRatio from './AssetRatio'
import CardHeading from './CardHeading'
import MiniChart from './MiniChart'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'
import { usePriceFinixUsd, useRebalanceBalances, useBalances } from '../../../state/hooks'

interface ExploreCardType {
  isHorizontal: boolean
  rebalance: Rebalance | any
  balance: BigNumber
  onClickViewDetail: () => void
}

const VerticalStyle = styled(Card)`
  display: flex;
  position: relative;
  flex-direction: column;
`

const HorizontalStyle = styled(Card)`
  width: 100%;
`

const HorizontalMobileStyle = styled(Card)`
  .accordion-content {
    &.hide {
      display: none;
    }

    &.show {
      display: block;
    }
  }
`

const BtnViewDetail: React.FC<{onClick: () => void}> = ({
  onClick
}) => {
  return (<Button minWidth="auto" scale="40" variant="lightbrown" as={Link} to="/rebalancing/detail" onClick={onClick} className="w-100">
    View Details
  </Button>)
}

const ExploreCard: React.FC<ExploreCardType> = ({
  balance,
  isHorizontal = true,
  rebalance = {},
  onClickViewDetail,
}) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { ratio } = rebalance
  const finixPrice = usePriceFinixUsd()

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

  const renderSash = () => {
    if (rebalance.rebalace?.toUpperCase() === 'NEW') {
      return <CardRibbon text={rebalance.rebalace} />;
    }

    return null
  }

  const allCurrentTokens = _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])
  if (isMobile) {
    return (
      <HorizontalMobileStyle className="mb-3" ribbon={renderSash()}>
        <CardHeading
          className="pa-4 pb-6"
          isHorizontal
          rebalance={rebalance}
        />

        <div>
          <div className="flex px-4 pb-5">
            <TwoLineFormat
              title="Total asset value"
              value={`$${numeral(_.get(rebalance, 'totalAssetValue', 0)).format('0,0.00')}`}
            />
            <TwoLineFormat
              title="Yield APR"
              value={`${numeral(
                finixPrice
                  .times(_.get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
                  .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
                  .times(100)
                  .toFixed(2),
              ).format('0,0.[00]')}%`}
              hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
            />
          </div>
          <div className="px-4 pb-5">
            <TwoLineFormat
              title="Share price (Since inception)"
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
          </div>
          <div className="px-4 py-3 bd-t">
            <TwoLineFormat
              className="pb-6"
              title="Current investment"
              value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
              currentInvestPercentDiff={`(${
                percentage > 0
                  ? `+${numeral(percentage).format('0,0.[00]')}`
                  : `${numeral(percentage).format('0,0.[00]')}`
              }%)`}
              diffAmounts={`${
                percentage > 0
                  ? `+${numeral(diffAmount).format('0,0.[000]')}`
                  : `${numeral(diffAmount).format('0,0.[000]')}`
              }`}
              percentClass={(() => {
                if (percentage < 0) return 'failure'
                if (percentage > 0) return 'success'
                return ''
              })()}
            />
            <BtnViewDetail onClick={onClickViewDetail} />
          </div>
        </div>
      </HorizontalMobileStyle>
    )
  }

  return (
    <HorizontalStyle className="mb-4" ribbon={renderSash()}>
      <CardBody>
        <CardHeading rebalance={rebalance} className="bd-b pb-5" />
        <div className="flex pt-5">
          <div className="flex flex-column justify-space-between px-0 bd-r" style={{width: '45.7%'}} >
            <div className="flex justify-space-between mb-4">
              <TwoLineFormat
                className="col-5"
                title="Total asset value"
                value={`$${numeral(rebalance.totalAssetValue).format('0,0.00')}`}
              />
              <TwoLineFormat
                className="col-5"
                title="Yield APR"
                value={`${numeral(
                  finixPrice
                    .times(_.get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
                    .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
                    .times(100)
                    .toFixed(2),
                ).format('0,0.[00]')}%`}
                hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
              />
            </div>
            <AssetRatio isHorizontal={isHorizontal} ratio={ratio} />
          </div>

          <div className="flex flex-grow">
            <div className="col-6 flex flex-column justify-space-between bd-r px-6">
              <TwoLineFormat
                title="Share price (Since inception)"
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
              <MiniChart color={rebalance.sharedPricePercentDiff >= 0 ? '#02a1a1' : '#ff5532'} tokens={allCurrentTokens} rebalanceAddress={getAddress(rebalance.address)} height={60} />
            </div>

            <div className="col-6 flex flex-column justify-space-between pl-6">
              <TwoLineFormat
                title="Current investment"
                value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
                currentInvestPercentDiff={`(${
                  percentage > 0
                    ? `+${numeral(percentage).format('0,0.[00]')}`
                    : `${numeral(percentage).format('0,0.[00]')}`
                }%)`}
                diffAmounts={`${
                  percentage > 0
                    ? `+${numeral(diffAmount).format('0,0.[000]')}`
                    : `${numeral(diffAmount).format('0,0.[000]')}`
                }`}
                percentClass={(() => {
                  if (percentage < 0) return 'failure'
                  if (percentage > 0) return 'success'
                  return ''
                })()}
              />
              <BtnViewDetail onClick={onClickViewDetail} />
            </div>
          </div>
        </div>
      </CardBody>
    </HorizontalStyle>
  )
}

export default ExploreCard
