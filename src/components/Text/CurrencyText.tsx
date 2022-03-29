import React from 'react'
import { Text } from '@fingerlabs/definixswap-uikit-v2'

const CurrencyText: React.FC<{
  value: number
  prefix?: string
  toFixed?: number
  [key: string]: any
}> = (props) => {
  const { value, prefix, toFixed = 2, ...rest } = props
  return (
    <Text {...rest}>
      {prefix || ''}
      {`$${Number(Number(value).toFixed(toFixed)).toLocaleString('en', { maximumFractionDigits: toFixed })}`}
    </Text>
  )
}
export default CurrencyText
