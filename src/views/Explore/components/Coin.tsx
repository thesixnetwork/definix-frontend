import React from 'react'
import { Flex, FlexProps } from 'definixswap-uikit-v2'
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

  img {
    flex-shrink: 0;
    width: ${getSize};
    height: ${getSize};
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const Coin: React.FC<CoinType> = ({ symbol, children, ...props }) => {
  return (
    <StyledCoin alignItems="center" {...props}>
      <img src={`/images/coins/${symbol || ''}.png`} alt={symbol} />
      {children}
    </StyledCoin>
  )
}

export default Coin
