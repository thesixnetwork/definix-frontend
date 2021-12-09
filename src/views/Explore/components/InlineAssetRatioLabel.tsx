import React, { useMemo } from 'react'
import numeral from 'numeral'
import { Flex, Text, VDivider } from 'definixswap-uikit-v2'
import Coin from './Coin'

const InlineAssetRatioLabel = ({ coin, column = false, small = false, ...props }) => {
  const thisName = (() => {
    if (coin.symbol === 'WKLAY') return 'KLAY'
    if (coin.symbol === 'WBNB') return 'BNB'
    return coin.symbol
  })()
  const size = useMemo(
    () =>
      small
        ? {
            coin: 'md',
            textM: 'R_14M',
            textR: 'R_14R',
          }
        : {
            coin: 'lg',
            textM: 'R_16M',
            textR: 'R_16R',
          },
    [small],
  )
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      py="S_8"
      flexDirection={column ? 'column' : 'row'}
      {...props}
    >
      <Flex flexGrow={1} width={column ? '100%' : ''}>
        <Coin size={size.coin} symbol={coin.symbol}>
          <Text textStyle={size.textM}>{thisName}</Text>
        </Coin>
        <Text textStyle={size.textR} color="textSubtle" ml="auto" textAlign="right">
          {coin.valueRatioCal.toFixed(2)}%
        </Text>
      </Flex>
      {!column && !small && <VDivider mx="S_20" my="5px" />}
      <Text textStyle={size.textM} color="deepgrey" minWidth={column ? '100%' : '140px'} textAlign="right">
        {coin.valueRatioCal && coin.amount ? numeral(coin.amount.toNumber()).format('0,0.[000000]') : '-'}
      </Text>
    </Flex>
  )
}

export default InlineAssetRatioLabel
