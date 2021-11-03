import React from 'react'
import { Text } from 'definixswap-uikit'
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
  const size = large ? {
    emphasize: '24px',
    subTitleFont: '14px',
    text: '16px',
  } : {
    emphasize: '16px',
    subTitleFont: '12px',
    text: '14px',
  }
  return (
    <div className={className}>
      <div className={`flex align-baseline ${alignRight ? 'justify-end' : ''}`}>
        <Text textStyle="R_12R" color={titleColor || 'mediumgrey'}>
          {title}
        </Text>

        {subTitle && (
          <Text fontSize={subTitleFontSize || size.subTitleFont} className="ml-1" as="span">
            {subTitle}
          </Text>
        )}

        {hint && <Helper text={hint} className="ml-1" position={hintPosition} />}
      </div>

      <div className={`flex align-baseline ${alignRight ? 'justify-end' : ''}`}>
        <Text fontSize={size.emphasize} bold color={valueClass}>
          {value}
        </Text>
        {diffAmounts !== '0' && (
          <Text fontSize={size.text} bold color={percentClass} className="ml-1">
            {diffAmounts}
          </Text>
        )}
        {currentInvestPercentDiff !== '(0%)' && (
          <Text fontSize={size.subTitleFont} bold color={percentClass} className="ml-1">
            {currentInvestPercentDiff}
          </Text>
        )}
        {percent && (
          <Text fontSize={size.text} bold color={percentClass} className="ml-1">
            {percent}
          </Text>
        )}
        {days && (
          <Text fontSize={size.text} className="ml-1">
            {days}
          </Text>
        )}
      </div>
    </div>
  )
}

export default TwoLineFormat
