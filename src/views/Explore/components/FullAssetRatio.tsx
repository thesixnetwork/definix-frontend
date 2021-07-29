import React from 'react'
import styled from 'styled-components'
import { Card, Text, useMatchBreakpoints } from 'uikit-dev'
import { Ratio } from 'config/constants/types'

interface FullAssetRatioType {
  className?: string
  ratio: Ratio[] | any
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

const FullAssetRatio: React.FC<FullAssetRatioType> = ({ ratio = [], className = '' }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-2">
        ASSET RATIO
      </Text>

      <div className="flex">
        {ratio.map((m) => (
          <Coin width={`${m.value}%`} isMobile={isMobile}>
            <Bar color={m.color} />
            <div className="name">
              <img src={`/images/coins/${m.symbol || ''}.png`} alt="" />
              <Text>{m.value}%</Text>
            </div>
          </Coin>
        ))}
      </div>
    </Card>
  )
}

export default FullAssetRatio
