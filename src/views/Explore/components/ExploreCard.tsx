import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import { getAddress } from 'utils/addressHelpers'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, useMatchBreakpoints } from 'uikit-dev'
import numeral from 'numeral'
import AssetRatio from './AssetRatio'
import CardHeading from './CardHeading'
import MiniChart from './MiniChart'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'
import { usePriceFinixUsd } from '../../../state/hooks'

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

  const allCurrentTokens = _.compact([...((rebalance || {}).tokens || [])])
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
                value={`$${numeral(rebalance.totalAssetValue || 0).format('0,0.00')}`}
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
