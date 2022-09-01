/* eslint-disable no-nested-ternary */
import { Box, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import React from 'react'
import styled from 'styled-components'
import { getTokenName } from 'utils/getTokenSymbol'
import _ from 'lodash'

const Coin = styled.div`
  display: flex;
  align-items: center;

  img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 12px;
  }
`

const VerticalAssetRatio = ({ rebalance = {}, poolAmounts = [], className = '' }) => {
  return (
    <Box className={className}>
      {_.compact([
        ...((rebalance || ({} as any)).tokens || []),
        ...(((rebalance || ({} as any)).usdTokenRatioPoint || 0).toString() === '0'
          ? []
          : (rebalance || ({} as any)).usdToken || []),
      ]).map((c, index) => {
        const thisName = getTokenName(c?.symbol)
        return (
          <Box key={c.symbol} display="flex" justifyContent="space-between" py="0.75rem">
            <Coin>
              <img src={`/images/coins/${c.symbol || ''}.png`} alt="" />
              <Typography variant="body2" fontWeight="bold">
                {thisName}
              </Typography>
            </Coin>

            <Typography variant="body2" pl={1}>
              {numeral(
                (poolAmounts[index] || new BigNumber(0)).div(new BigNumber(10).pow(c.decimals)).toNumber(),
              ).format('0,0.[0000000000]')}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

export default VerticalAssetRatio
