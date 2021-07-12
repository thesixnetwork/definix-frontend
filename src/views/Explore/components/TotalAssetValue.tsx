import React from 'react'
import { Text } from 'uikit-dev'

interface TotalAssetValueType {
  className?: string
}

const TotalAssetValue: React.FC<TotalAssetValueType> = ({ className = '' }) => {
  return (
    <div className={className}>
      <Text fontSize="12px" color="textSubtle">
        Total asset value
      </Text>
      <Text bold>$2,038,553.12</Text>
    </div>
  )
}

export default TotalAssetValue
