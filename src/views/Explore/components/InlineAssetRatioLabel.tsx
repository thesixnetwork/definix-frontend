import React from 'react'
import numeral from 'numeral'
import { Flex, Text } from 'definixswap-uikit'
import Coin from './Coin'

const InlineAssetRatioLabel = ({ coin, className = '' }) => {
  const thisName = (() => {
    if (coin.symbol === 'WKLAY') return 'KLAY'
    if (coin.symbol === 'WBNB') return 'BNB'
    return coin.symbol
  })()
  return (
    <Flex justifyContent="space-between" alignItems="center" py="S_8" className={className} flexGrow={1}>
      <Coin size="lg" symbol={coin.symbol}>
        <Text textStyle="R_16M">{thisName}</Text>
      </Coin>
      <Text textStyle="R_16R" color="textSubtle" ml="auto" textAlign="right">
        {coin.valueRatioCal.toFixed(2)}%
      </Text>
      <Text textStyle="R_16M" color="deepgrey" minWidth="160px" textAlign="right">
        {coin.amount ? numeral(coin.amount.toNumber()).format('0,0.[0000]') : '-'}
      </Text>
    </Flex>
  )
}

export default InlineAssetRatioLabel
