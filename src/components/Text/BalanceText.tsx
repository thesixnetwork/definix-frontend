import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Text } from '@fingerlabs/definixswap-uikit-v2'

const BalanceText: React.FC<{
  value: number | string
  toFixed?: number
  postfix?: string
  [key: string]: any
}> = (props) => {
  const { value, toFixed = 6, postfix, ...rest } = props
  const decimalPlaces = useMemo(() => Math.min(new BigNumber(value).decimalPlaces(), toFixed), [value, toFixed])
  const formatedValue = useMemo(() => new BigNumber(value).toFormat(decimalPlaces, 1), [value, decimalPlaces])

  const ValueShow = value === '-' ? value : formatedValue

  return (
    <Text {...rest}>
      {ValueShow || '0'}
      {postfix && <span className="unit"> {postfix}</span>}
    </Text>
  )
}
export default BalanceText
