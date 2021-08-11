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
  valueClass?: string
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
  valueClass,
}) => {
  return (
    <div className={className}>
      <div className={`flex ${alignRight ? 'justify-end' : ''}`} style={{ lineHeight: '0' }}>
        <Text fontSize="14px" color="textSubtle">
          {title}
        </Text>

        {subTitle && (
          <Text fontSize="14px" className="ml-1">
            {subTitle}
          </Text>
        )}

        {hint && <Helper text={hint} className="ml-1" position="top" />}
      </div>

      <div className={`flex align-baseline ${alignRight ? 'justify-end' : ''}`}>
        <Text fontSize={large ? '24px' : '16px'} bold color={valueClass} lineHeight={large ? '1.3' : '1.5'}>
          {value}
        </Text>
        {percent && (
          <Text fontSize="16px" bold color={percentClass} /* || failure */ className="ml-1">
            {percent}
          </Text>
        )}
        {days && (
          <Text fontSize={large ? '16px' : '14px'} className="ml-1">
            {days}
          </Text>
        )}
      </div>
    </div>
  )
}

export default TwoLineFormat
