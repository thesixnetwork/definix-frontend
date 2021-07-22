import React from 'react'
import { Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'

interface SpaceBetweenFormatType {
  title?: string
  titleElm?: any
  value?: string
  valueElm?: any
  className?: string
  valueColor?: string
  hint?: string
}

const SpaceBetweenFormat: React.FC<SpaceBetweenFormatType> = ({
  className = '',
  title,
  titleElm,
  value,
  valueElm,
  valueColor = 'text',
  hint = '',
}) => {
  return (
    <div className={`flex justify-space-between align-center ${className}`}>
      {titleElm || (
        <div className="flex pr-3">
          <Text fontSize="12px" color="textSubtle">
            {title}
          </Text>
          {hint && <Helper text={hint} className="ml-2" position="top" />}
        </div>
      )}
      {valueElm || (
        <Text color={valueColor} bold>
          {value}
        </Text>
      )}
    </div>
  )
}

export default SpaceBetweenFormat
