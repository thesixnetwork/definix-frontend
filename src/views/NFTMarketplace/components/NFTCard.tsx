import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import { useMatchBreakpoints } from '../../../uikit-dev/hooks'
import CardHeading from './CardHeading'
import ListDetailModal from './ListDetailModal'
import DetailsSection from './DetailSelection'
import { NFTCardProps } from './types'

const CardStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
`

const VerticalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
`

const NFTCard: React.FC<NFTCardProps> = ({
  isHorizontal = false,
  inlineMultiplier = false,
  isMarketplace,
  data,
  typeName,
}) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const [showAccordion, setShowAccordion] = useState(false)
  const [onPresentConnectModal] = useModal(<ListDetailModal />)

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
    (className?: string) => (
      <DetailsSection isHorizontal={isHorizontal} className={className} data={data} typeName={typeName} />
    ),
    [data, typeName, isHorizontal],
  )

  if (typeName === 'Grid') {
    return (
      <VerticalStyle className="mb-7" onClick={() => onPresentConnectModal()}>
        <div className="flex flex-column flex-grow">{renderCardHeading('')}</div>
        {renderDetailsSection('px-5 py-3')}
      </VerticalStyle>
    )
  }
  return (
    <VerticalStyle className="mb-7" onClick={() => onPresentConnectModal()}>
      <div className="flex flex-column flex-grow">{renderCardHeading('')}</div>
      {renderDetailsSection('px-5 py-3')}
    </VerticalStyle>
  )
}

export default NFTCard
