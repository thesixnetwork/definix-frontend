/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'definixswap-uikit'
import { ChevronUpIcon, ChevronDownIcon } from 'uikit-dev'
import { Rebalance } from '../../../state/types'

interface CardHeadingType {
  isHorizontal?: boolean
  onlyTitle?: boolean
  className?: string
  rebalance: Rebalance | any
}

const FocusImg = styled.img<{ isHorizontal: boolean }>`
  border-radius: 6px;
  border: solid 1px #979797;
  width: ${({ isHorizontal }) => (isHorizontal ? '100%' : '160px')};
  height: auto;
  object-fit: contain;
  margin-right: ${({ isHorizontal }) => (isHorizontal ? '' : '32px')};
  margin-bottom: ${({ isHorizontal }) => (isHorizontal ? '24px' : '')};
  background: ${({ theme }) => theme.colors.backgroundBox};
`

const CardHeading: React.FC<CardHeadingType> = ({
  isHorizontal = false,
  className = '',
  onlyTitle = false,
  rebalance = {},
}) => {
  return (
    <Flex justifyContent="space-between" className={className}>
      <Flex
        flexDirection={isHorizontal ? 'column' : 'row'}
        justifyContent={isHorizontal ? 'center' : ''}
        alignItems={!isHorizontal && onlyTitle ? 'center' : 'start'}
      >
        <FocusImg src={rebalance.icon[0]} alt="" isHorizontal={isHorizontal} />

        {onlyTitle ? (
          <div>
            <Text textStyle="R_20B" textTransform="uppercase" className="mb-1">
              {rebalance.title}
            </Text>
          </div>
        ) : (
          <div>
            <Text textStyle="R_16B" textTransform="uppercase" className="mb-1">
              {rebalance.title}
            </Text>
            <Text textStyle="R_12R">{rebalance.description}</Text>
          </div>
        )}
      </Flex>
    </Flex>
  )
}

export default CardHeading
