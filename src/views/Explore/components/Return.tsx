import React from 'react'
import { Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'

interface ReturnType {
  className?: string
}

const Return: React.FC<ReturnType> = ({ className = '' }) => {
  return (
    <div className={className}>
      <div className="flex" style={{ lineHeight: '0' }}>
        <Text fontSize="12px" color="textSubtle">
          Return
        </Text>
        <Helper text="" className="ml-1" position="top" />
      </div>

      <Text bold>00%</Text>
    </div>
  )
}

export default Return
