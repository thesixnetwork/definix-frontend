import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from 'definixswap-uikit'
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
      width: 20px;
      height: 20px;
      border-radius: 50%;
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
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <div className={`flex ${className}`}>
      {ratio
        .filter((r) => r.value)
        .map((m) => (
          <Coin width={`${m.value}%`} isMobile={isMobile}>
            <Bar color={m.color} />
            <div className="name">
              <img src={`/images/coins/${m.symbol || ''}.png`} alt="" />
              <Text textStyle="R_14R">{m.value}%</Text>
            </div>
          </Coin>
        ))}
    </div>
  )
}

export default FullAssetRatio
