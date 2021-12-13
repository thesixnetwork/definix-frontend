import React from 'react'
import numeral from 'numeral'
import { Text } from 'definixswap-uikit-v2'

const CurrencyText: React.FC<{
  value: number
  prefix?: string
  toFixed?: number
  [key: string]: any
}> = (props) => {
  const { value, prefix, toFixed = 2, ...rest } = props
  return (
    <Text {...rest}>
      {prefix || ''} {`$${numeral(value).format(`0,0.[${'0'.repeat(toFixed)}]`)}`}
    </Text>
  )
}
export default CurrencyText
