import React, { useMemo } from 'react'
import { Flex, FlexProps, Coin as UikitCoin } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

const Size = {
  sm: '20px',
  md: '24px',
  lg: '32px',
}

interface CoinType extends FlexProps {
  symbol?: string
  size?: string
  spacing?: string
  isVertical?: boolean
}

const getSize = (size?: string) => {
  switch (size) {
    case 'sm':
      return Size.sm
    case 'lg':
      return Size.lg
    default:
      return Size.md
  }
}

const StyledCoin = styled(Flex)<{ spacing?: string; isVertical?: boolean }>`
  width: ${({ isVertical }) => (isVertical ? '33.333%' : 'auto')};
`

const Coin: React.FC<CoinType> = ({ symbol, children, size, spacing, isVertical, ...props }) => {
  const space = useMemo(
    () =>
      spacing
        ? {
            ...(isVertical ? { mb: spacing } : { mr: spacing }),
          }
        : null,
    [isVertical, spacing],
  )

  return (
    <StyledCoin alignItems="center" spacing={spacing} isVertical={isVertical} {...props}>
      <UikitCoin symbol={symbol} size={getSize(size)} {...space} />
      {children}
    </StyledCoin>
  )
}

export default Coin
