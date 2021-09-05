import React, { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import axios from 'axios'
import { getAddress } from 'utils/addressHelpers'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, useMatchBreakpoints } from 'uikit-dev'
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

const CardStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
`

const VerticalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
  flex-direction: column;
`

const HorizontalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
`

const HorizontalMobileStyle = styled(CardStyle)`
  .accordion-content {
    &.hide {
      display: none;
    }

    &.show {
      display: block;
    }
  }
`

const ExploreCard: React.FC<ExploreCardType> = ({
  balance,
  isHorizontal = false,
  rebalance = {},
  onClickViewDetail,
}) => {
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { ratio } = rebalance
  const finixPrice = usePriceFinixUsd()

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

  const api = 'https://d6x5x5n4v3.execute-api.ap-southeast-1.amazonaws.com'

  const [totalUsd, setTotalUsd] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const sharedprice = numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')

  const combinedAmount = useCallback(
    async (rebalances, accounts) => {
      // get total_usd_amount new tx_hash
      const getData = JSON.parse(localStorage.getItem('my_invest_tx'))
      const txnHash = getData.transactionHash
      if (Object.keys(getData).length !== 0) {
        const txHash = {
          txns: [txnHash],
        }

        const txns = txHash
        const resp = await axios.post(`${api}/txns_usd_amount`, txns)

        if (resp.data.success) {
          const datas = resp.data
          const total = _.get(datas, 'total_usd_amount')

          if (sharedprice !== 0) {
            const totalUsdAmount = total + totalUsd
            const diffNewAmount = ((sharedprice - totalUsdAmount) / totalUsdAmount) * 100
            setPercentage(diffNewAmount)
          }
        }
      }

      // get total_usd_amount
      const poolAddr = _.get(rebalances, 'factsheet.vault', '')
      const res = await axios.get(`${api}/total_txn_amount?pool=${poolAddr}&address=${accounts}`)
      const isLocalStorage = JSON.parse(localStorage.getItem('my_invest_tx'))
      const array = []
      array.push(isLocalStorage)

      if (res.data.success) {
        const datas = res.data
        const latestTxns = _.get(datas, 'latest_txn')
        const totalUsds = _.get(datas, 'total_usd_amount')

        if (array.length > 0) {
          array.map((item) => {
            return (
              item.transactionHash === latestTxns &&
              localStorage.setItem('my_invest_tx', JSON.stringify(array.slice(1)))
            )
          })
        }
        setTotalUsd(totalUsds)
        if (sharedprice > 0) {
          const diffPercent = ((sharedprice - totalUsd) / totalUsd) * 100
          setPercentage(diffPercent)
        }
      }
    },
    [sharedprice, totalUsd],
  )

  useEffect(() => {
    combinedAmount(rebalance, account)
  }, [rebalance, account, combinedAmount])

  const allCurrentTokens = _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])
  if (isHorizontal) {
    if (isMobile) {
      return (
        <HorizontalMobileStyle className="mb-3">
          <CardHeading
            className="pa-4"
            showAccordion
            isHorizontal
            isOpenAccordion={isOpenAccordion}
            setIsOpenAccordion={setIsOpenAccordion}
            rebalance={rebalance}
          />
          <div style={{ display: isOpenAccordion ? 'block' : 'none' }}>
            <div className="flex justify-space-between pa-4 pt-0">
              <TwoLineFormat
                title="Total asset value"
                value={`$${numeral(_.get(rebalance, 'totalAssetValue', 0)).format('0,0.00')}`}
              />
              <TwoLineFormat
                title="Share price"
                subTitle="(Since inception)"
                subTitleFontSize="11px"
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

            <MiniChart tokens={allCurrentTokens} rebalanceAddress={getAddress(rebalance.address)} />

            <div className="pa-4">
              <div className="flex align-end justify-space-between mb-3">
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
                <TwoLineFormat
                  title="Current investment"
                  value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
                  days={`${numeral(balance.toFixed(2)).format('0,0.[00]')} Shares`}
                  currentInvestPercentDiff={`${
                    percentage > 0
                      ? `+${numeral(percentage).format('0,0.[00]')}`
                      : `${numeral(percentage).format('0,0.[00]')}`
                  }%`}
                  percentClass={(() => {
                    if (percentage < 0) return 'failure'
                    if (percentage > 0) return 'success'
                    return ''
                  })()}
                />
              </div>
              <Button fullWidth radii="small" as={Link} to="/rebalancing/detail" onClick={onClickViewDetail}>
                View Details
              </Button>
            </div>

            <AssetRatio ratio={ratio} isHorizontal={false} className="px-4 py-3 bd-t" />
          </div>
        </HorizontalMobileStyle>
      )
    }

    return (
      <HorizontalStyle className="flex align-strench mb-5 pa-5">
        <CardHeading isHorizontal={isHorizontal} rebalance={rebalance} className="col-3 pr-4 bd-r" />

        <div className="col-9 flex">
          <div className="col-6 flex flex-column justify-space-between px-4 bd-r">
            <div className="flex justify-space-between mb-2">
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

          <div className="col-3 pl-4 pr-2 flex flex-column justify-space-between">
            <TwoLineFormat
              title="Share price"
              subTitle="(Since inception)"
              subTitleFontSize="11px"
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
            <MiniChart tokens={allCurrentTokens} rebalanceAddress={getAddress(rebalance.address)} height={60} />
          </div>

          <div className="col-3 pl-2 flex flex-column justify-space-between">
            <TwoLineFormat
              title="Current investment"
              value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
              days={`${numeral(balance.toFixed(2)).format('0,0.[00]')} Shares`}
              currentInvestPercentDiff={`${
                percentage > 0
                  ? `+${numeral(percentage).format('0,0.[00]')}`
                  : `${numeral(percentage).format('0,0.[00]')}`
              }%`}
              percentClass={(() => {
                if (percentage < 0) return 'failure'
                if (percentage > 0) return 'success'
                return ''
              })()}
            />
            <Button fullWidth radii="small" as={Link} to="/rebalancing/detail" onClick={onClickViewDetail}>
              View Details
            </Button>
          </div>
        </div>
      </HorizontalStyle>
    )
  }

  return (
    <VerticalStyle className="mb-7">
      <CardHeading className="pa-4" isSkew isHorizontal={isHorizontal} rebalance={rebalance} />

      <div className="flex justify-space-between pa-4 pt-0">
        <TwoLineFormat
          title="Total asset value"
          value={`$${numeral(_.get(rebalance, 'totalAssetValue', 0)).format('0,0.00')}`}
        />
        <TwoLineFormat
          title="Share price"
          subTitle="(Since inception)"
          subTitleFontSize="11px"
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

      <MiniChart tokens={allCurrentTokens} rebalanceAddress={getAddress(rebalance.address)} />

      <div className="pa-4">
        <div className="flex align-end justify-space-between mb-3">
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
          <TwoLineFormat
            title="Current investment"
            value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
            days={`${numeral(balance.toFixed(2)).format('0,0.[00]')} Shares`}
            currentInvestPercentDiff={`${
              percentage > 0
                ? `+${numeral(percentage).format('0,0.[00]')}`
                : `${numeral(percentage).format('0,0.[00]')}`
            }%`}
            percentClass={(() => {
              if (percentage < 0) return 'failure'
              if (percentage > 0) return 'success'
              return ''
            })()}
          />
        </div>
        <Button fullWidth radii="small" as={Link} to="/rebalancing/detail" onClick={onClickViewDetail}>
          View Details
        </Button>
      </div>

      <AssetRatio isHorizontal={isHorizontal} ratio={ratio} className="px-4 py-3 bd-t" />
    </VerticalStyle>
  )
}

export default ExploreCard
