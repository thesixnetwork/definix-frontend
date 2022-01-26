import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { Ratio } from 'config/constants/types'
import CoinWrap from './CoinWrap'

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
  }
`

const Bar = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  height: 24px;
  width: calc(100% - 1px);
  margin-bottom: 12px;
`

const FullAssetRatio: React.FC<FullAssetRatioType> = ({ ratio = [], className = '' }) => {
  const { isMaxXl } = useMatchBreakpoints()
  const isMobile = isMaxXl

  return (
    <div className={`flex ${className}`}>
      {ratio
        .filter((r) => r.value)
        .map((m) => (
          <Asset key={m.symbol} width={`${m.value}%`} isMobile={isMobile}>
            <Bar color={m.color} />
            <CoinWrap className="name" symbol={m.symbol || ''} size="sm" spacing="S_4" isVertical={isMobile}>
              <Text textStyle="R_14R">{m.value}%</Text>
            </CoinWrap>
          </Asset>
        ))}
    </div>
  )
}

export default FullAssetRatio