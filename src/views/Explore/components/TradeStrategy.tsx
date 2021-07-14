import React from 'react'
import { Card, Text } from 'uikit-dev'

interface TradeStrategyType {
  className?: string
}

const TradeStrategy: React.FC<TradeStrategyType> = ({ className = '' }) => {
  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-1">
        TRADE STRATEGY
      </Text>
      <Text fontSize="12px">
        Rebalancing is the process of realigning the weightings of a portfolio of assets. Rebalancing involves
        periodically buying or selling assets in a portfolio to maintain an original or desired level of asset
        allocation or risk.
      </Text>
      <Text fontSize="12px">- Selling the high performers and reinvesting that money into lower performers</Text>
      <Text fontSize="12px">- Funnelling new money into lower performers</Text>
    </Card>
  )
}

export default TradeStrategy
