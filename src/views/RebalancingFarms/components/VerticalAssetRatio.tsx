import React from 'react'
import { compact } from 'lodash-es'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import { getTokenName } from 'utils/getTokenSymbol'
import CoinWrap from './CoinWrap'

const VerticalAssetRatio = ({ rebalance = {}, poolAmounts = [], className = '' }) => {
  return (
    <Flex flexDirection="column" className={className}>
      {compact([
        ...((rebalance || ({} as any)).tokens || []),
        ...(((rebalance || ({} as any)).usdTokenRatioPoint || 0).toString() === '0'
          ? []
          : (rebalance || ({} as any)).usdToken || []),
      ]).map((c, index) => {
        const thisName = getTokenName(c?.symbol)
        return (
          <Flex key={c.symbol} textStyle="R_14R" justifyContent="space-between" alignItems="center" className="py-s12">
            <CoinWrap size="sm" symbol={c.symbol || ''} spacing="S_6">
              <Text textStyle="R_14B" style={{ width: '56px' }}>
                {thisName}
              </Text>
            </CoinWrap>
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
