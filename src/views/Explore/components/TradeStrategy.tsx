import React from 'react'
import { Card, Text } from 'uikit-dev'

interface TradeStrategyType {
  className?: string
  description?: string
}

const TradeStrategy: React.FC<TradeStrategyType> = ({ className = '', description = '' }) => {
  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-1">
        DESCRIPTION
      </Text>
      <Text fontSize="14px">{description}</Text>
    </Card>
  )
}

export default TradeStrategy
