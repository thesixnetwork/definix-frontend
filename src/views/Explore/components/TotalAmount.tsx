/* eslint-disable no-nested-ternary */
import { CheckRounded } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import Coin from 'uikitV2/components/Coin'

const Item = ({ coin, onApprove }) => {
  const thisName = coin.symbol === 'WKLAY' ? 'KLAY' : coin.symbol === 'WBNB' ? 'BNB' : coin.symbol

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      mb={{ xs: 3, sm: 1 }}
    >
      <Box display="flex" alignItems="center">
        <Coin symbol={coin.symbol} large />
        <Typography fontWeight="bold">
          {coin.currentValue}

          <Typography component="span" ml={1} color="text.disabled" fontWeight="bold">
            {thisName}
          </Typography>
        </Typography>
      </Box>
      <Box mt={{ xs: 1, sm: 0 }}>
        {!coin.needsApproval || !coin.currentValue ? (
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ maxWidth: { sm: '200px' }, display: 'flex' }}
            startIcon={<CheckRounded />}
            disabled
          >
            {`${thisName} Approved`}
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ maxWidth: { sm: '140px' } }}
            onClick={() => {
              onApprove(coin)
            }}
          >
            Approve {thisName}
          </Button>
        )}
      </Box>
    </Box>
  )
}

const TotalAmount = ({ coins = [], onApprove, className = '' }) => {
  return (
    <Box className={className}>
      {coins.map((c) => {
        return <Item key={c.symbol} coin={c} onApprove={onApprove} />
      })}
    </Box>
  )
}

export default TotalAmount
