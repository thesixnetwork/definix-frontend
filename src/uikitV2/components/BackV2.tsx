import { ArrowBackRounded } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const BackV2 = ({ to }) => {
  return (
    <Box className="mb-2">
      <Button
        variant="text"
        component={Link}
        to={to}
        startIcon={<ArrowBackRounded color="inherit" />}
        sx={{ fontWeight: 'normal', color: (theme) => theme.palette.text.disabled }}
      >
        Back
      </Button>
    </Box>
  )
}

export default BackV2
