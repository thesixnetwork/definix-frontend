import React from 'react'
import numeral from 'numeral'
import { Text } from 'definixswap-uikit'

const CurrencyText: React.FC<any> = (props) => {
  const { value, prefix, ...rest } = props
  return (
    <Text {...rest}>
      {prefix || ''} {`$${numeral(value).format('0,0.[00]')}`}
    </Text>
  )
}
export default CurrencyText
