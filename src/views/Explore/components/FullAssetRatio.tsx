import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from 'definixswap-uikit'
import { Ratio } from 'config/constants/types'
import Coin from './Coin'

interface FullAssetRatioType {
  className?: string
  ratio: Ratio[] | any
}

const Asset = styled.div<{ width: string; isMobile: boolean }>`
  width: ${({ width }) => width};

  .name {
    display: flex;
    flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
    align-items: ${({ isMobile }) => (isMobile ? 'flex-start' : 'center')};

    img {
      margin-right: 4px;
    }
  }
`

const Bar = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  height: 24px;
  width: calc(100% - 1px);
  margin-bottom: 12px;
`

const FullAssetRatio: React.FC<FullAssetRatioType> = ({ ratio = [], className = '' }) => {
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl

  return (
    <div className={`flex ${className}`}>
      {ratio
        .filter((r) => r.value)
        .map((m) => (
          <Asset width={`${m.value}%`} isMobile={isMobile}>
            <Bar color={m.color} />
            <Coin className="name" symbol={m.symbol || ''} size="sm">
              <Text textStyle="R_14R">{m.value}%</Text>
            </Coin>
          </Asset>
        ))}
    </div>
  )
}

export default FullAssetRatio
