import React from 'react'
import { Button, Text } from 'uikit-dev'

interface PriceUpdateType {
  className?: string
}

const PriceUpdate: React.FC<PriceUpdateType> = ({ className = '' }) => {
  return (
    <div className={`flex align-center ${className}`}>
      <Text className="mr-3">Price Updated</Text>

      <Button size="sm" className="flex-shrink">
        Recalculate
      </Button>
    </div>
  )
}

export default PriceUpdate
