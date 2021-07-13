import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, useMatchBreakpoints, Text } from 'uikit-dev'
import Apy from './Apy'
import AssetRatio from './AssetRatio'
import CardHeading from './CardHeading'
import MiniChart from './MiniChart'
import SharePrice from './SharePrice'
import TotalAssetValue from './TotalAssetValue'

interface ExploreCardType {
  isHorizontal: boolean
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

const ExploreCard: React.FC<ExploreCardType> = ({ isHorizontal = false }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  if (isHorizontal) {
    if (isMobile) {
      return (
        <HorizontalMobileStyle className="mb-3 pa-4">
          <CardHeading isHorizontal={false} />
          <AssetRatio isHorizontal={isHorizontal} />
        </HorizontalMobileStyle>
      )
    }

    return (
      <HorizontalStyle className="flex align-strench mb-5 pa-5">
        <CardHeading isHorizontal={isHorizontal} className="col-3 pr-4 bd-r" />

        <div className="col-5 flex flex-column justify-space-between px-4 bd-r">
          <div className="flex justify-space-between mb-2">
            <TotalAssetValue className="col-6" />
            <Apy className="col-6" />
          </div>
          <AssetRatio isHorizontal={isHorizontal} />
        </div>

        <div className="col-2 px-4">
          <SharePrice className="mb-2" />
          <MiniChart height={60} />
        </div>

        <div className="col-2 flex flex-column justify-center">
          <Text textAlign="center" className="mb-2">
            128 INVESTORS
          </Text>
          <Button fullWidth radii="card" as={Link} to="/explore/detail">
            View Details
          </Button>
        </div>
      </HorizontalStyle>
    )
  }

  return (
    <VerticalStyle className="mb-7">
      <div className="pa-4">
        <CardHeading isHorizontal={isHorizontal} className="mb-3" />
        <div className="flex justify-space-between">
          <TotalAssetValue />
          <SharePrice />
        </div>
      </div>

      <MiniChart />

      <div className="pa-4">
        <div className="flex align-end justify-space-between mb-2">
          <Text textAlign="center">128 INVESTORS</Text>
          <Apy />
        </div>
        <Button fullWidth radii="card" as={Link} to="/explore/detail">
          View Details
        </Button>
      </div>

      <AssetRatio isHorizontal={isHorizontal} className="px-4 py-3 bd-t" />
    </VerticalStyle>
  )
}

export default ExploreCard
