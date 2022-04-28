import React from 'react'
import _ from 'lodash'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Text } from 'uikit-dev'

const Coin = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 16px 4px 0;

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
    <div className={className}>
      {_.compact([
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
          <div className="flex justify-space-between align-center">
            <Coin>
              <img src={`/images/coins/${c.symbol.toLowerCase() || ''}.png`} alt="" />
              <Text bold>
                {numeral(
                  (poolAmounts[index] || new BigNumber(0)).div(new BigNumber(10).pow(c.decimals)).toNumber(),
                ).format('0,0.[0000000000]')}
              </Text>
            </Coin>
            <Text bold className="pl-3" style={{ width: '56px' }} textAlign="left">
              {thisName}
            </Text>
          </div>
        )
      })}
    </div>
  )
}

export default VerticalAssetRatio
