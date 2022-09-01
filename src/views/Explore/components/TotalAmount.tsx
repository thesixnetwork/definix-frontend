/* eslint-disable no-nested-ternary */
import { CheckRounded } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import styled from 'styled-components'

const Coin = styled.div`
  display: flex;
  align-items: center;

  img {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 12px;
  }
`

const Item = ({ coin, onApprove }) => {
  const thisName = coin.symbol === 'WKLAY' ? 'KLAY' : coin.symbol === 'WBNB' ? 'BNB' : coin.symbol

  return (
    <Box display="flex" justifyContent="space-between" mb={1}>
      <Coin>
        <img src={`/images/coins/${coin.symbol || ''}.png`} alt="" />
        <Typography fontWeight="bold">
          {coin.currentValue}

          <Typography component="span" ml={1} color="text.disabled" fontWeight="bold">
            {thisName}
          </Typography>
        </Typography>
      </Coin>

      {!coin.needsApproval || !coin.currentValue ? (
        <Button
          variant="outlined"
          color="secondary"
          sx={{ width: '200px', display: 'flex' }}
          startIcon={<CheckRounded />}
          disabled
        >
          {`${thisName} Approved`}
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          sx={{ width: '140px' }}
          onClick={() => {
            onApprove(coin)
          }}
        >
          Approve {thisName}
        </Button>
      )}
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
