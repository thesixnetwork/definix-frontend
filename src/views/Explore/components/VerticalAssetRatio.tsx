import React from 'react'
import { compact } from 'lodash'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, Text } from 'definixswap-uikit'

const Coin = styled.div`
  display: flex;
  align-items: center;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

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
          <Flex textStyle="R_14R" justifyContent="space-between" alignItems="center" className="py-s12">
            <Coin>
              <img src={`/images/coins/${c.symbol || ''}.png`} alt="" />
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
