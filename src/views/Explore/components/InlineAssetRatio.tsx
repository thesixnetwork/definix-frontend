import { Box, Divider, Typography } from '@mui/material'
import numeral from 'numeral'
import React from 'react'
import Coin from 'uikitV2/components/Coin'

const InlineAssetRatio = ({ coin }) => {
  const thisName = (() => {
    if (coin.symbol === 'WKLAY') return 'KLAY'
    if (coin.symbol === 'WBNB') return 'BNB'
    return coin.symbol
  })()
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" py={1}>
      <Coin name={thisName} symbol={coin.symbol} large flexGrow={1} />
      <Typography color="text.disabled">{coin.valueRatioCal.toFixed(2)}%</Typography>
      <Divider orientation="vertical" flexItem sx={{ m: '4px 20px', display: { xs: 'none', sm: 'block' } }} />

      <Typography sx={{ minWidth: { xs: '100%', sm: '140px' } }} align="right" color="text.secondary">
        {coin.amount ? numeral(coin.amount.toNumber()).format('0,0.[0000]') : '-'}
      </Typography>
    </Box>
  )
}

export default InlineAssetRatio
