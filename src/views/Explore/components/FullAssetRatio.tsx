import React from 'react'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'

interface FullAssetRatioType {
  className?: string
}

const Coin = styled.div<{ width: string }>`
  width: ${({ width }) => width};

  .name {
    display: flex;
    align-items: center;

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
  const mockData = [
    {
      img: '/images/coins/BTC.png',
      value: '40%',
      color: '#FF8C3C',
    },
    {
      img: '/images/coins/bnb.png',
      value: '20%',
      color: '#E2B23A',
    },
    {
      img: '/images/coins/six.png',
      value: '15%',
      color: '#647BD4',
    },
    {
      img: '/images/coins/FINIX.png',
      value: '15%',
      color: '#EBEBEB',
    },
    {
      img: '/images/coins/usdt.png',
      value: '10%',
      color: '#2A9D8F',
    },
  ]

  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-2">
        ASSET RATIO
      </Text>

      <div className="flex">
        {mockData.map((m) => (
          <Coin width={m.value}>
            <Bar color={m.color} />
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
