import { Card as MuiCard, styled } from '@mui/material'
import React from 'react'

const CardStyle = styled(MuiCard)`
  background-color: rgb(255, 255, 255);
  border-radius: 1rem;
  box-shadow: rgb(255 237 203) 0px 0px 0px 1px, rgb(254 169 72 / 20%) 0px 12px 12px 0px;
  position: relative;
  overflow: auto;
`

const Card = ({ children, ...props }) => {
  return <CardStyle {...props}>{children}</CardStyle>
}

export default Card
