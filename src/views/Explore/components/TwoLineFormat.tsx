import React from 'react'
import { Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'
import styled from 'styled-components'

const Coin = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: block;
  flex-shrink: 0;
`

interface TwoLineFormatType {
  className?: string
  title: string
  subTitle?: string
  subTitleFontSize?: string
  titleColor?: string
  coin?: any
  value: string
  subValue?: string
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
  coin,
  value,
  subValue,
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
      <div className={`flex flex-wrap align-baseline ${alignRight ? 'justify-end' : ''}`} style={{ lineHeight: '0' }}>
        {coin && <Coin src={coin} alt="" className="align-self-center" />}

        <Text fontSize="14px" color={titleColor || 'textSubtle'}>
          {title}
        </Text>

        {subTitle && (
          <Text fontSize={subTitleFontSize || (large ? '14px' : '12px')} className="ml-1">
            {subTitle}
          </Text>
        )}

        {hint && <Helper text={hint} className="ml-1 align-self-center" position={hintPosition} />}
      </div>

      <div className={`flex flex-wrap align-baseline ${alignRight ? 'justify-end' : ''}`}>
        <Text fontSize={large ? '24px' : '16px'} bold color={valueClass} lineHeight={large ? '1.3' : '1.5'}>
          {value}
        </Text>
        {diffAmounts && diffAmounts !== '0' && (
          <Text fontSize={large ? '16px' : '14px'} bold color={percentClass} className="ml-1">
            {diffAmounts}
          </Text>
        )}
        {currentInvestPercentDiff && currentInvestPercentDiff !== '(0%)' && (
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
        {subValue && (
          <Text fontSize="12px" color="textSubtle" className="ml-1">
            {subValue}
          </Text>
        )}
      </div>
    </div>
  )
}

export default TwoLineFormat
