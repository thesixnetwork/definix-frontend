import { Box, styled, Toolbar } from '@mui/material'
import React from 'react'

const BoxStyle = styled(Box)`
  position: relative;
  flex-grow: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 360px;
    background: #fffbf5;
  }
`

const InnerLayout = ({ children }) => {
  return (
    <BoxStyle>
      <Toolbar sx={{ height: { xs: '56px', md: '80px' } }} />
      {children}
    </BoxStyle>
  )
}

export default InnerLayout
