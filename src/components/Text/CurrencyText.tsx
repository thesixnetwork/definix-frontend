import React, {useMemo} from 'react'
import { Text } from '@fingerlabs/definixswap-uikit-v2'

const CurrencyText: React.FC<{
  value: number | string
  prefix?: string
  toFixed?: number
  [key: string]: any
}> = (props) => {
  const { value, prefix, toFixed = 2, ...rest } = props
  const currency = useMemo(() => {
    let currencyValue = value;
    if(typeof currencyValue === 'string') {
      currencyValue = currencyValue.replaceAll(',', '');
    }
    return Number(Number(value).toFixed(toFixed)).toLocaleString('en', { maximumFractionDigits: toFixed })
  }, [value])
  return (
    <Text {...rest}>
      {prefix || ''}
      {`$${currency}`}
    </Text>
  )
}
export default CurrencyText
