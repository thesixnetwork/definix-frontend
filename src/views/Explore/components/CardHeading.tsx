import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'

interface CardHeadingType {
  isHorizontal?: boolean
  className?: string
}

const FocusImg = styled.img<{ isHorizontal: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.circle};
  margin-right: ${({ isHorizontal }) => (isHorizontal ? '' : '16px')};
  margin-bottom: ${({ isHorizontal }) => (isHorizontal ? '8px' : '')};
  background: ${({ theme }) => theme.colors.backgroundBox};
`

const CardHeading: React.FC<CardHeadingType> = ({ isHorizontal = false, className = '' }) => {
  return (
    <div className={`${className} flex ${isHorizontal ? 'flex-column justify-center' : 'align-center'}`}>
      <FocusImg src="#" alt="" isHorizontal={isHorizontal} />
      <div>
        <Text color="primary" bold>
          AUTO REBALANCING FUND
        </Text>
        <Text bold>RE-BALANCING : BTC FOCUS</Text>
      </div>
    </div>
  )
}

export default CardHeading
