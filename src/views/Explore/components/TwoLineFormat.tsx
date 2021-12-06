import React from 'react'
import { Flex, FlexProps, Helper, Text } from 'definixswap-uikit'
import { isNil } from 'lodash'

interface TwoLineFormatType extends FlexProps {
  className?: string
  title: string
  subTitle?: string
  titleColor?: string
  titleMarginBottom?: number
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
  titleColor,
  titleMarginBottom = 0,
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
  ...props
}) => {
  const textStyle = large
    ? {
        emphasize: 'R_20M',
        subTitle: 'R_14R',
        text: 'R_12M',
      }
    : {
        emphasize: 'R_18M',
        subTitle: 'R_12R',
        text: 'R_12M',
      }
  return (
    <Flex flexDirection="column" className={className} {...props}>
      <Flex alignItems="center" justifyContent={alignRight ? 'flex-end' : 'inherit'} mb={large ? 'S_4' : 'S_2'}>
        <Text
          textStyle={textStyle.subTitle}
          color={titleColor || 'mediumgrey'}
          style={{ marginBottom: `${titleMarginBottom}px` }}
        >
          {title}
        </Text>

        {subTitle && (
          <Text textStyle={textStyle.subTitle} ml="S_8" as="span">
            {subTitle}
          </Text>
        )}

        {hint && <Helper text={hint} ml="S_8" position={hintPosition} />}
      </Flex>

      <Flex alignItems="baseline" justifyContent={alignRight ? 'flex-end' : 'inherit'}>
        <Text textStyle={textStyle.emphasize} bold color={valueClass}>
          {value}
        </Text>
        {!isNil(diffAmounts) && diffAmounts !== '0' && (
          <Text textStyle={textStyle.text} bold color={percentClass} ml="S_8">
            {diffAmounts}
          </Text>
        )}
        {!isNil(currentInvestPercentDiff) && currentInvestPercentDiff !== '(0%)' && (
          <Text textStyle={textStyle.subTitle} bold color={percentClass} ml="S_8">
            {currentInvestPercentDiff}
          </Text>
        )}
        {percent && (
          <Text textStyle="R_12M" color={percentClass} ml="S_8">
            {percent}
          </Text>
        )}
        {days && (
          <Text textStyle={textStyle.text} ml="S_8">
            {days}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default TwoLineFormat
