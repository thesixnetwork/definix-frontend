import React, { useEffect, useState } from 'react'
import { getAddress } from 'utils/addressHelpers'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Text, useMatchBreakpoints } from 'uikit-dev'
import numeral from 'numeral'
import AssetRatio from './AssetRatio'
import CardHeading from './CardHeading'
import MiniChart from './MiniChart'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'

interface ExploreCardType {
  isHorizontal: boolean
  rebalance: Rebalance | any
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
  justify-content: space-between;
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

const ExploreCard: React.FC<ExploreCardType> = ({ isHorizontal = false, rebalance = {}, onClickViewDetail }) => {
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { ratio } = rebalance

  useEffect(() => {
    return () => {
      setIsOpenAccordion(false)
    }
  }, [])

  if (isHorizontal) {
    if (isMobile) {
      return (
        <HorizontalMobileStyle className="mb-3">
          <CardHeading
            className="pa-4"
            showAccordion
            isOpenAccordion={isOpenAccordion}
            setIsOpenAccordion={setIsOpenAccordion}
            rebalance={rebalance}
          />
          <div style={{ display: isOpenAccordion ? 'block' : 'none' }}>
            <div className="flex justify-space-between pa-4 pt-0">
              <TwoLineFormat
                title="Total asset value"
                value={`$${numeral(rebalance.totalAssetValue).format('0,0.00')}`}
              />
              <TwoLineFormat
                title="Share price"
                value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
                percent={`${
                  rebalance.sharedPricePercentDiff >= 0
                    ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                    : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                }%`}
                percentClass={(() => {
                  if (rebalance.sharedPricePercentDiff < 0) return 'failure'
                  if (rebalance.sharedPricePercentDiff > 0) return 'success'
                  return ''
                })()}
              />
            </div>

            <MiniChart rebalanceAddress={getAddress(rebalance.address)} />

            <div className="pa-4">
              <div className="flex align-end justify-space-between mb-2">
                <Text textAlign="center">{numeral(rebalance.activeUserCountNumber).format('0,0')} INVESTORS</Text>
                <TwoLineFormat title="APY" value="00%" hint="xxx" alignRight />
              </div>
              <Button fullWidth radii="small" as={Link} to="/explore/detail" onClick={onClickViewDetail}>
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

        <div className="col-5 flex flex-column justify-space-between px-4 bd-r">
          <div className="flex justify-space-between mb-2">
            <TwoLineFormat
              className="col-6"
              title="Total asset value"
              value={`$${numeral(rebalance.totalAssetValue).format('0,0.00')}`}
            />
            <TwoLineFormat className="col-6" title="APY" value="00%" hint="xxx" />
          </div>
          <AssetRatio isHorizontal={isHorizontal} ratio={ratio} />
        </div>

        <div className="col-2 px-4">
          <TwoLineFormat
            className="mb-2"
            title="Share price"
            value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
            percent={`${
              rebalance.sharedPricePercentDiff >= 0
                ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
            }%`}
            percentClass={(() => {
              if (rebalance.sharedPricePercentDiff < 0) return 'failure'
              if (rebalance.sharedPricePercentDiff > 0) return 'success'
              return ''
            })()}
          />
          <MiniChart rebalanceAddress={getAddress(rebalance.address)} height={60} />
        </div>

        <div className="col-2 flex flex-column justify-center">
          <Text textAlign="center" className="mb-2">
            {numeral(rebalance.activeUserCountNumber).format('0,0')} INVESTORS
          </Text>
          <Button fullWidth radii="small" as={Link} to="/explore/detail" onClick={onClickViewDetail}>
            View Details
          </Button>
        </div>
      </HorizontalStyle>
    )
  }

  return (
    <VerticalStyle className="mb-7">
      <CardHeading className="pa-4" isHorizontal={isHorizontal} rebalance={rebalance} />

      <div className="flex justify-space-between pa-4 pt-0">
        <TwoLineFormat title="Total asset value" value={`$${numeral(rebalance.totalAssetValue).format('0,0.00')}`} />
        <TwoLineFormat
          title="Share price"
          value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
          percent={`${
            rebalance.sharedPricePercentDiff >= 0
              ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
              : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
          }%`}
          percentClass={(() => {
            if (rebalance.sharedPricePercentDiff < 0) return 'failure'
            if (rebalance.sharedPricePercentDiff > 0) return 'success'
            return ''
          })()}
        />
      </div>

      <MiniChart rebalanceAddress={getAddress(rebalance.address)} />

      <div className="pa-4">
        <div className="flex align-end justify-space-between mb-2">
          <Text textAlign="center">{numeral(rebalance.activeUserCountNumber).format('0,0')} INVESTORS</Text>
          <TwoLineFormat title="APY" value="00%" hint="xxx" alignRight />
        </div>
        <Button fullWidth radii="small" as={Link} to="/explore/detail" onClick={onClickViewDetail}>
          View Details
        </Button>
      </div>

      <AssetRatio isHorizontal={isHorizontal} ratio={ratio} className="px-4 py-3 bd-t" />
    </VerticalStyle>
  )
}

export default ExploreCard
