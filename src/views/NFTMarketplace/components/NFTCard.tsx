import BigNumber from 'bignumber.js'
// import { BASE_ADD_LIQUIDITY_URL } from 'config'
// import { QuoteToken } from 'config/constants/types'
// import useStake from 'hooks/useStake'
// import useUnstake from 'hooks/useUnstake'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
// import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import { useMatchBreakpoints } from '../../../uikit-dev/hooks'
import CardHeading from './CardHeading'
// import { useMatchBreakpoints } from 'uikit-dev'
// import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
// import FarmContext from '../../FarmContext'
// import CardHeading from './CardHeading'
// import CardHeadingAccordion from './CardHeadingAccordion'
import DetailsSection from './DetailSelection'
// import HarvestActionAirDrop from './HarvestActionAirDrop'
// import StakeAction from './StakeAction'
import { NFTCardProps } from './types'

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

const NFTCard: React.FC<NFTCardProps> = ({ isHorizontal = false, inlineMultiplier = false }) => {
  //   const { onPresent } = useContext(FarmContext)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const [showAccordion, setShowAccordion] = useState(false)

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  const renderCardHeading = useCallback(
    (className?: string) => (
      <CardHeading
        isSkew={false}
        isHorizontal={isHorizontal}
        showAccordion={showAccordion}
        isOpenAccordion={isOpenAccordion}
        className={className}
        setIsOpenAccordion={setIsOpenAccordion}
      />
    ),
    [isHorizontal, isOpenAccordion, showAccordion],
  )

  const renderDetailsSection = useCallback(
    (className?: string, isHor?: boolean) => <DetailsSection isHorizontal={isHor} className={className} />,
    [],
  )

  console.log('isHorizontal', isHorizontal)

  //   if (!isHorizontal) {
  return (
    <VerticalStyle className="mb-7 mt-5">
      <div className="flex flex-column flex-grow">
        {renderCardHeading('pt-7')}
        {/* {renderCardHeading('pt-7')} */}
        {/* {renderStakeAction('pa-5')} */}
        {/* renderHarvestAction('pa-5') */}
        {/* {renderHarvestActionAirDrop('pa-5 pt-0', isHorizontal)} */}
      </div>
      {renderDetailsSection('px-5 py-3', false)}
    </VerticalStyle>
  )
  //   }
}

export default NFTCard
