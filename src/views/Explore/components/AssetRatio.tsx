import { Ratio } from 'config/constants/types'
import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'

interface AssetRatioType {
  isHorizontal: boolean
  className?: string
  ratio: Ratio[] | any
}

const Coin = styled.div<{ isHorizontal?: boolean }>`
  display: flex;
  align-items: center;
  margin: 4px 0;
  padding: 0 8px;
  width: ${({ isHorizontal }) => (!isHorizontal ? '33.333%' : 'auto')};

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const AssetRatio: React.FC<AssetRatioType> = ({ isHorizontal = false, className = '', ratio = [] }) => {
  return (
    <div className={className}>
      <Text
        fontSize="14px"
        color="textSubtle"
        className={!isHorizontal ? 'mb-2' : ''}
        textAlign={isHorizontal ? 'left' : 'center'}
      >
        Asset ratio
      </Text>
      <div className="flex flex-wrap" style={{ marginLeft: isHorizontal ? '-8px' : '' }}>
        {ratio
          .filter((r) => r.value)
          .map((m) => (
            <Coin isHorizontal={isHorizontal}>
              <img src={`/images/coins/${m.symbol.toLowerCase() || ''}.png`} alt={m.symbol} />
              <Text fontSize="16px">{m.value}%</Text>
            </Coin>
          ))}
      </div>
    </div>
  )
}

export default AssetRatio
