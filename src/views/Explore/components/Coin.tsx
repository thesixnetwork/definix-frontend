import React from 'react'
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
  isHorizontal?: boolean
}

const getSize = ({ size }: CoinType) => {
  switch (size) {
    case 'sm':
      return Size.sm
    default:
      return Size.md
  }
}

const StyledCoin = styled(Flex)<{ size?: string; isHorizontal?: boolean }>`
  width: ${({ isHorizontal }) => (!isHorizontal ? '33.333%' : 'auto')};
`

const Coin: React.FC<CoinType> = ({ symbol, children, size, ...props }) => {
  return (
    <StyledCoin alignItems="center" {...props}>
      <UikitCoin
        symbol={symbol}
        size={getSize({
          size,
        })}
      />
      {children}
    </StyledCoin>
  )
}

export default Coin
