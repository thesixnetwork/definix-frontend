import { Box, Container, styled } from '@mui/material'
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
      <Container
        maxWidth="lg"
        sx={{ px: { xs: '1.25rem !important', lg: '3.75rem !important' }, pt: { xs: '84px', lg: '108px' } }}
      >
        {children}
      </Container>
    </BoxStyle>
  )
}

export default InnerLayout
