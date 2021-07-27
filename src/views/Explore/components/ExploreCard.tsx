import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Text, useMatchBreakpoints } from 'uikit-dev'
import AssetRatio from './AssetRatio'
import CardHeading from './CardHeading'
import MiniChart from './MiniChart'
import TwoLineFormat from './TwoLineFormat'

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
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

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
          />
          <div style={{ display: isOpenAccordion ? 'block' : 'none' }}>
            <div className="flex justify-space-between pa-4 pt-0">
              <TwoLineFormat title="Total asset value" value="$2,038,553.12" />
              <TwoLineFormat title="Share price" value="$1,928.03" percent="+0.2%" />
            </div>

            <MiniChart />

            <div className="pa-4">
              <div className="flex align-end justify-space-between mb-2">
                <Text textAlign="center">128 INVESTORS</Text>
                <TwoLineFormat title="APY" value="00%" hint="xxx" alignRight />
              </div>
              <Button fullWidth radii="small" as={Link} to="/explore/detail">
                View Details
              </Button>
            </div>

            <AssetRatio isHorizontal={false} className="px-4 py-3 bd-t" />
          </div>
        </HorizontalMobileStyle>
      )
    }

    return (
      <HorizontalStyle className="flex align-strench mb-5 pa-5">
        <CardHeading isHorizontal={isHorizontal} className="col-3 pr-4 bd-r" />

        <div className="col-5 flex flex-column justify-space-between px-4 bd-r">
          <div className="flex justify-space-between mb-2">
            <TwoLineFormat className="col-6" title="Total asset value" value="$2,038,553.12" />
            <TwoLineFormat className="col-6" title="APY" value="00%" hint="xxx" />
          </div>
          <AssetRatio isHorizontal={isHorizontal} />
        </div>

        <div className="col-2 px-4">
          <TwoLineFormat className="mb-2" title="Share price" value="$1,928.03" percent="+0.2%" />
          <MiniChart height={60} />
        </div>

        <div className="col-2 flex flex-column justify-center">
          <Text textAlign="center" className="mb-2">
            128 INVESTORS
          </Text>
          <Button fullWidth radii="small" as={Link} to="/explore/detail">
            View Details
          </Button>
        </div>
      </HorizontalStyle>
    )
  }

  return (
    <VerticalStyle className="mb-7">
      <CardHeading className="pa-4" isHorizontal={isHorizontal} />

      <div className="flex justify-space-between pa-4 pt-0">
        <TwoLineFormat title="Total asset value" value="$2,038,553.12" />
        <TwoLineFormat title="Share price" value="$1,928.03" percent="+0.2%" />
      </div>

      <MiniChart />

      <div className="pa-4">
        <div className="flex align-end justify-space-between mb-2">
          <Text textAlign="center">128 INVESTORS</Text>
          <TwoLineFormat title="APY" value="00%" hint="xxx" alignRight />
        </div>
        <Button fullWidth radii="small" as={Link} to="/explore/detail">
          View Details
        </Button>
      </div>

      <AssetRatio isHorizontal={isHorizontal} className="px-4 py-3 bd-t" />
    </VerticalStyle>
  )
}

export default ExploreCard
