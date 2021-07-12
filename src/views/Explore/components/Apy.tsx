import React from 'react'
import { Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'

interface ApyType {
  className?: string
}

const Apy: React.FC<ApyType> = ({ className = '' }) => {
  return (
    <div className={className}>
      <div className="flex" style={{ lineHeight: '0' }}>
        <Text fontSize="12px" color="textSubtle">
          APY
        </Text>
        <Helper text="" className="ml-1" position="top" />
      </div>

      <Text bold>00%</Text>
    </div>
  )
}

export default Apy
