import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'
import { Ratio } from 'config/constants/types'

interface AssetRatioType {
  isHorizontal: boolean
  className?: string
  ratio: Ratio[] | any
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

const AssetRatio: React.FC<AssetRatioType> = ({ isHorizontal = false, className = '', ratio = [] }) => {
  return (
    <div className={className}>
      <Text fontSize="12px" color="textSubtle" textAlign={isHorizontal ? 'left' : 'center'}>
        Asset ratio
      </Text>
      <div className="flex flex-wrap">
        {ratio.map((m) => (
          <Coin>
            <img src={`/images/coins/${m.symbol || ''}.png`} alt={m.symbol} />
            <Text>{m.value}%</Text>
          </Coin>
        ))}
      </div>
    </div>
  )
}

export default AssetRatio
