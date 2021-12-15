import React from 'react'
import numeral from 'numeral'
import { Text } from 'definixswap-uikit-v2'

const BalanceText: React.FC<{
  value: number | string
  toFixed?: number
  [key: string]: any
}> = (props) => {
  const { value, toFixed = 6, ...rest } = props
  return <Text {...rest}>{numeral(value).format(`0,0.[${'0'.repeat(toFixed)}]`)}</Text>
}
export default BalanceText
