import React from 'react'
import { compact } from 'lodash'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { Flex, Text } from 'definixswap-uikit-v2'
import Coin from './Coin'

const VerticalAssetRatio = ({ rebalance = {}, poolAmounts = [], className = '' }) => {
  return (
    <Flex flexDirection="column" className={className}>
      {compact([
        ...((rebalance || ({} as any)).tokens || []),
        ...(((rebalance || ({} as any)).usdTokenRatioPoint || 0).toString() === '0'
          ? []
          : (rebalance || ({} as any)).usdToken || []),
      ]).map((c, index) => {
        const thisName = (() => {
          if (c.symbol === 'WKLAY') return 'KLAY'
          if (c.symbol === 'WBNB') return 'BNB'
          return c.symbol
        })()
        return (
          <Flex key={c.symbol} textStyle="R_14R" justifyContent="space-between" alignItems="center" className="py-s12">
            <Coin size="sm" symbol={c.symbol || ''}>
              <Text textStyle="R_14B" style={{ width: '56px' }}>
                {thisName}
              </Text>
            </Coin>
            <Text>
              {numeral(
                (poolAmounts[index] || new BigNumber(0)).div(new BigNumber(10).pow(c.decimals)).toNumber(),
              ).format('0,0.[0000000000]')}
            </Text>
          </Flex>
        )
      })}
    </Flex>
  )
}

export default VerticalAssetRatio
