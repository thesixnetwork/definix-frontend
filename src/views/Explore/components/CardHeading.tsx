/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import { Text, ChevronUpIcon, ChevronDownIcon } from 'uikit-dev'
import { Rebalance } from '../../../state/types'

interface CardHeadingType {
  isHorizontal?: boolean
  showAccordion?: boolean
  isOpenAccordion?: boolean
  className?: string
  setIsOpenAccordion?: (open: boolean) => void
  rebalance: Rebalance | any
}

const FocusImg = styled.img<{ isHorizontal: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.circle};
  margin-right: ${({ isHorizontal }) => (isHorizontal ? '' : '16px')};
  margin-bottom: ${({ isHorizontal }) => (isHorizontal ? '8px' : '')};
  background: ${({ theme }) => theme.colors.backgroundBox};
`

const CardHeading: React.FC<CardHeadingType> = ({
  isHorizontal = false,
  className = '',
  showAccordion = false,
  isOpenAccordion = false,
  setIsOpenAccordion,
  rebalance = {},
}) => {
  return (
    <div
      className={`${className} flex justify-space-between`}
      onClick={
        showAccordion
          ? () => {
              setIsOpenAccordion(!isOpenAccordion)
            }
          : undefined
      }
    >
      <div className={`flex ${isHorizontal ? 'flex-column justify-center' : 'align-center'}`}>
        <FocusImg src={rebalance.icon} alt="" isHorizontal={isHorizontal} />
        <div>
          <Text color="primary" bold>
            {rebalance.title}
          </Text>
          <Text bold>{rebalance.description}</Text>
        </div>
      </div>

      {showAccordion && (
        <>{isOpenAccordion ? <ChevronUpIcon color="textSubtle" /> : <ChevronDownIcon color="textSubtle" />}</>
      )}
    </div>
  )
}

export default CardHeading
