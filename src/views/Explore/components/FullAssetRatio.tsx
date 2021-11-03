import React from 'react'
import styled from 'styled-components'
import Color from 'color'
import { Text, useMatchBreakpoints } from 'definixswap-uikit'
import useTheme from 'hooks/useTheme'
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
  const { isDark } = useTheme()
  const isMobile = !isXl

  return (
    <div className={`flex ${className}`}>
      {ratio
        .filter((r) => r.value)
        .map((m) => {
          const color = Color(m.color);
          const displayColor = ((dark, c) => {
            if (dark) {
              return c.isDark() ? c.lighten(0.1): c.hex();
            }
            return c.isLight() ? c.darken(0.1): c.hex();
          })(isDark, color);
          return (
            <Coin width={`${m.value}%`} isMobile={isMobile}>
              <Bar color={displayColor} />
              <div className="name">
                <img src={`/images/coins/${m.symbol || ''}.png`} alt="" />
                <Text fontSize="16px">{m.value}%</Text>
              </div>
            </Coin>
          )
        })}
    </div>
  )
}

export default FullAssetRatio
