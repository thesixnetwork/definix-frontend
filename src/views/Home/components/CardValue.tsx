import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from 'uikit-dev'

export interface CardValueProps {
  value?: number
  decimals?: number
  fontSize?: string
  lineHeight?: string
  prefix?: string
  suffix?: string
  bold?: boolean
  color?: string
  fontWeight?: string
  valueString?: string
}

const CardValue: React.FC<CardValueProps> = ({
  value = 0,
  decimals,
  fontSize = '30px',
  lineHeight = '1',
  prefix = '',
  suffix = '',
  bold = true,
  fontWeight = 'bold',
  color = 'text',
  valueString
}) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <Text fontWeight={fontWeight} bold={bold} fontSize={fontSize} style={{ lineHeight }} color={color}>
      {prefix}
      {valueString || countUp}
      {suffix}
    </Text>
  )
}

export default CardValue
