import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import { useMatchBreakpoints } from '../../../uikit-dev/hooks'
import CardHeading from './CardHeading'
import ListDetailModal from './ListDetailModal'
import ListGroupModal from './ListGroupModal'
import DetailsSection from './DetailSelection'
import { NFTCardProps } from './types'

const CardStyle = styled.div<{ isHorizontal?: boolean; isMarketplace?: boolean }>`
  background: ${(props) => props.theme.card.background};
  box-shadow: ${({ theme }) => (theme.isDark ? '0 6px 16px #000000' : theme.shadows.elevation2)};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
`

const VerticalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  cursor: pointer;
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
  console.log("typeName", typeName)
  const [onPresentConnectModal] = useModal(typeName !== 'Group' ?<ListDetailModal isMarketplace={isMarketplace} /> : <ListGroupModal/>)

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
      <DetailsSection
        isHorizontal={isHorizontal}
        className={className}
        data={data}
        typeName={typeName}
        isMarketplace={isMarketplace}
      />
    ),
    [data, typeName, isHorizontal, isMarketplace],
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
      <div className="flex flex-column flex-grow" style={{position: 'sticky'}}>{renderCardHeading('')}</div>
      {renderDetailsSection('px-5 py-3')}
    </VerticalStyle>
  )
}

export default NFTCard
