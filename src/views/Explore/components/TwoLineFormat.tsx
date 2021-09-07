import React from 'react'
import { Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'

interface TwoLineFormatType {
  className?: string
  title: string
  subTitle?: string
  subTitleFontSize?: string
  titleColor?: string
  value: string
  percent?: string
  hint?: string
  hintPosition?: string
  large?: boolean
  days?: string
  alignRight?: boolean
  percentClass?: string
  valueClass?: string
  currentInvestPercentDiff?: string
  diffAmounts?: string
}

const TwoLineFormat: React.FC<TwoLineFormatType> = ({
  className = '',
  title,
  subTitle,
  subTitleFontSize,
  titleColor,
  value,
  percent,
  hint,
  hintPosition = 'top',
  large = false,
  days,
  alignRight = false,
  percentClass = 'success',
  valueClass,
  currentInvestPercentDiff,
  diffAmounts,
}) => {
  return (
    <div className={className}>
      <div className={`flex align-baseline ${alignRight ? 'justify-end' : ''}`} style={{ lineHeight: '0' }}>
        <Text fontSize="14px" color={titleColor || 'textSubtle'}>
          {title}
        </Text>

        {subTitle && (
          <Text fontSize={subTitleFontSize || (large ? '14px' : '12px')} className="ml-1">
            {subTitle}
          </Text>
        )}

        {hint && <Helper text={hint} className="ml-1" position={hintPosition} />}
      </div>

      <div className={`flex align-baseline ${alignRight ? 'justify-end' : ''}`}>
        <Text fontSize={large ? '24px' : '16px'} bold color={valueClass} lineHeight={large ? '1.3' : '1.5'}>
          {value}
        </Text>
        {diffAmounts !== '+0' && (
          <Text fontSize={large ? '16px' : '14px'} bold color={percentClass} className="ml-1">
            {diffAmounts}
          </Text>
        )}
        {currentInvestPercentDiff !== '(0%)' && (
          <Text fontSize={large ? '14px' : '12px'} bold color={percentClass} className="ml-1">
            {currentInvestPercentDiff}
          </Text>
        )}
        {percent && (
          <Text fontSize={large ? '16px' : '14px'} bold color={percentClass} className="ml-1">
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
