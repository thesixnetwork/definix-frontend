import React from 'react'
import { Text } from 'uikit-dev'

interface SharePriceType {
  className?: string
}

const SharePrice: React.FC<SharePriceType> = ({ className = '' }) => {
  return (
    <div className={className}>
      <Text fontSize="12px" color="textSubtle">
        Share price
      </Text>
      <div className="flex align-baseline">
        <Text bold>$1,928.03</Text>
        <Text fontSize="12px" bold color="success" className="ml-1">
          +0.2%
        </Text>
      </div>
    </div>
  )
}

export default SharePrice
