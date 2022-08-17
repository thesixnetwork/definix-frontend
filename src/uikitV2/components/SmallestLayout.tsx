import { Box } from '@mui/material'
import React from 'react'

const SmallestLayout = ({ children }) => {
  return (
    <Box maxWidth="629px" className="mx-auto">
      {children}
    </Box>
  )
}

export default SmallestLayout
