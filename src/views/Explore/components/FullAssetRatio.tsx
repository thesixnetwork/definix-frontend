import React from 'react'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'

interface FullAssetRatioType {
  className?: string
}

const Coin = styled.div`
  .name {
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
  }
`

const FullAssetRatio: React.FC<FullAssetRatioType> = ({ className = '' }) => {
  const mockData = [
    {
      img: '/images/coins/BTC.png',
      value: '40%',
    },
    {
      img: '/images/coins/bnb.png',
      value: '20%',
    },
    {
      img: '/images/coins/six.png',
      value: '15%',
    },
    {
      img: '/images/coins/FINIX.png',
      value: '25%',
    },
    {
      img: '/images/coins/usdt.png',
      value: '10%',
    },
  ]

  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-1">
        ASSET RATIO
      </Text>

      <div className="flex">
        {mockData.map((m) => (
          <Coin>
            <div className="name">
              <img src={m.img} alt="" />
              <Text>{m.value}</Text>
            </div>
          </Coin>
        ))}
      </div>
    </Card>
  )
}

export default FullAssetRatio
