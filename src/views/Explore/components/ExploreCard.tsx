import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'

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
  text-align: center;
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
      return <HorizontalMobileStyle className="mb-3">wenf</HorizontalMobileStyle>
    }

    return <HorizontalStyle className="flex align-stretch px-5 py-6 mb-5">ewkd</HorizontalStyle>
  }

  return <VerticalStyle className="mb-7">osd</VerticalStyle>
}

export default ExploreCard
