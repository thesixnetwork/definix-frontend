import React from 'react'
import styled from 'styled-components'
import { Card, Text, useMatchBreakpoints } from 'uikit-dev'
import currency from '../mockCurrency'

interface FullAssetRatioType {
  className?: string
}

const Coin = styled.div<{ width: string; isMobile: boolean }>`
  width: ${({ width }) => width};

  .name {
    display: flex;
    flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
    align-items: ${({ isMobile }) => (isMobile ? 'flex-start' : 'center')};

    img {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: ${({ theme }) => theme.radii.circle};
      margin-right: 6px;
    }
  }
`

const Bar = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  height: 12px;
  width: 100%;
  margin-bottom: 8px;
`

const FullAssetRatio: React.FC<FullAssetRatioType> = ({ className = '' }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-2">
        ASSET RATIO
      </Text>

      <div className="flex">
        {currency.map((m) => (
          <Coin width={m.percent} isMobile={isMobile}>
            <Bar color={m.color} />
            <div className="name">
              <img src={m.img} alt="" />
              <Text>{m.percent}</Text>
            </div>
          </Coin>
        ))}
      </div>
    </Card>
  )
}

export default FullAssetRatio
