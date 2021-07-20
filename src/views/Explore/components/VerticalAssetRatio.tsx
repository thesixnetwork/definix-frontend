import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'
import currency from '../mockCurrency'

interface VerticalAssetRatioType {
  className?: string
}

const Coin = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 16px 4px 0;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const VerticalAssetRatio: React.FC<VerticalAssetRatioType> = ({ className = '' }) => {
  return (
    <div className={className}>
      {currency.map((m) => (
        <div className="flex justify-space-between align-center">
          <Coin>
            <img src={m.img} alt="" />
            <Text bold>{m.value}</Text>
          </Coin>
          <Text bold className="pl-3">
            {m.name}
          </Text>
        </div>
      ))}
    </div>
  )
}

export default VerticalAssetRatio
