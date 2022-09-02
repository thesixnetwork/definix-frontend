import { Box, Typography } from '@mui/material'
import React from 'react'

const Coin = ({ name = '', symbol = '', size = 20, fontWeight = 'bold', large = false, ...props }) => {
  return (
    <Box display="flex" alignItems="center" {...props}>
      {symbol && (
        <img
          src={`/images/coins/${symbol}.png`}
          alt=""
          width={`${large ? 32 : size}px`}
          height={`${large ? 32 : size}px`}
          style={{ marginRight: large ? '12px' : '8px' }}
        />
      )}
      {name && (
        <Typography variant={large ? 'body1' : 'body2'} fontWeight={fontWeight}>
          {name}
        </Typography>
      )}
    </Box>
  )
}

export default Coin
