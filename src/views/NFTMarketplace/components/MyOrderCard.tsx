import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import useModal from '../../../uikit-dev/widgets/Modal/useModal'
import { useMatchBreakpoints } from '../../../uikit-dev/hooks'
import CardHeadingOrder from './CardHeadingOrder'
import ListDetailModal from './ModalNFT/ListDetailModal'
import ListGroupModal from './ModalNFT/ListGroupModal'
import DetailOrder from './DetailOrder'
import { NFTCardProps } from './types'
import { fetchSyncDatabyOrder } from '../../../state/actions'

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

const MyOrderCard: React.FC<NFTCardProps> = ({
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
  const dispatch = useDispatch()
  const [onPresentConnectModal] = useModal(
    typeName !== 'Group' ? (
      <ListDetailModal data={data} isMarketplace={isMarketplace} typeName={typeName} isOnSell />
    ) : (
      <ListGroupModal data={data} code typeName={typeName} />
    ),
  )

  const callSyncUserData = () => {
    dispatch(fetchSyncDatabyOrder(data.orderId))
    onPresentConnectModal()
  }

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  const renderCardHeading = useCallback(
    (className?: string) => (
      <CardHeadingOrder
        data={data}
        isSkew={false}
        isHorizontal={isHorizontal}
        showAccordion={showAccordion}
        isOpenAccordion={isOpenAccordion}
        className={className}
        setIsOpenAccordion={setIsOpenAccordion}
      />
    ),
    [isHorizontal, isOpenAccordion, showAccordion, data],
  )

  const renderDetailsSection = useCallback(
    (className?: string) => (
      <DetailOrder
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
      <VerticalStyle className="mb-7" onClick={() => callSyncUserData()}>
        <div className="flex flex-column flex-grow">{renderCardHeading('')}</div>
        {renderDetailsSection('px-5 py-3')}
      </VerticalStyle>
    )
  }
  return (
    <VerticalStyle className="mb-7" onClick={() => callSyncUserData()}>
      <div className="flex flex-column flex-grow" style={{ position: 'sticky' }}>
        {renderCardHeading('')}
      </div>
      {renderDetailsSection('px-5 py-3')}
    </VerticalStyle>
  )
}

export default MyOrderCard
