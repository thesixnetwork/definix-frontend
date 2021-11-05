/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'definixswap-uikit'
import { ChevronUpIcon, ChevronDownIcon } from 'uikit-dev'
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
  width: ${({ isHorizontal }) => (isHorizontal ? '100%' : '160px')};;
  height: auto;
  object-fit: contain;
  margin-right: ${({ isHorizontal }) => (isHorizontal ? '' : '32px')};
  margin-bottom: ${({ isHorizontal }) => (isHorizontal ? '24px' : '')};
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
    <Flex
      justifyContent="space-between"
      className={className}
      onClick={
        showAccordion
          ? () => {
              setIsOpenAccordion(!isOpenAccordion)
            }
          : undefined
      }
    >
      <div className={`flex ${isHorizontal ? 'flex-column justify-center' : 'align-start'}`}>
        <FocusImg src={rebalance.icon[0]} alt="" isHorizontal={isHorizontal} />

        <div>
          <Text textStyle="R_16B" textTransform="uppercase" className="mb-1">
            {rebalance.title}
          </Text>
          <Text textStyle="R_12R">{rebalance.description}</Text>
        </div>
      </div>

      {showAccordion && (
        <>{isOpenAccordion ? <ChevronUpIcon color="textSubtle" /> : <ChevronDownIcon color="textSubtle" />}</>
      )}
    </Flex>
  )
}

export default CardHeading
