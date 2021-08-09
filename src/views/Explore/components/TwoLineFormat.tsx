import React from 'react'
import { Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'

interface TwoLineFormatType {
  className?: string
  title: string
  subTitle?: string
  value: string
  percent?: string
  hint?: string
  large?: boolean
  days?: string
  alignRight?: boolean
  percentClass?: string
}

const TwoLineFormat: React.FC<TwoLineFormatType> = ({
  className = '',
  title,
  subTitle,
  value,
  percent,
  hint,
  large = false,
  days,
  alignRight = false,
  percentClass = 'success',
}) => {
  return (
    <div className={className}>
      <div className={`flex ${alignRight ? 'justify-end' : ''}`} style={{ lineHeight: '0' }}>
        <Text fontSize="12px" color="textSubtle">
          {title}
        </Text>

        {subTitle && (
          <Text fontSize="12px" className="ml-1">
            {subTitle}
          </Text>
        )}

        {hint && <Helper text={hint} className="ml-1" position="top" />}
      </div>

      <div className={`flex align-baseline ${alignRight ? 'justify-end' : ''}`}>
        <Text fontSize={large ? '24px' : '14px'} bold lineHeight={large ? '1.3' : '1.5'}>
          {value}
        </Text>
        {percent && (
          <Text fontSize={large ? '14px' : '12px'} bold color={percentClass} /* || failure */ className="ml-1">
            {percent}
          </Text>
        )}
        {days && (
          <Text fontSize={large ? '14px' : '12px'} className="ml-1">
            {days}
          </Text>
        )}
      </div>
    </div>
  )
}

export default TwoLineFormat
