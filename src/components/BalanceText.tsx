import React from 'react'
import numeral from 'numeral'
import { Text } from 'definixswap-uikit'

const BalanceText: React.FC<any> = (props) => {
  const { value, ...rest } = props
  return <Text {...rest}>{numeral(value).format('0,0.[000000]')}</Text>
}
export default BalanceText
