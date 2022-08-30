import { Box, Typography } from '@mui/material'
import React from 'react'

const NoData = ({ text, height = undefined }) => {
  return (
    <Box sx={{ height: height || '400px' }} py={3} display="flex" justifyContent="center" alignItems="center">
      <Typography variant="body2" textAlign="center" color="text.disabled">
        {text}
      </Typography>
    </Box>
  )
}

export default NoData
