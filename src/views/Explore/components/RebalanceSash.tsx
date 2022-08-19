import { Box, styled } from '@mui/material'
import React from 'react'

const RebalanceSashStyle = styled(Box)`
  background-color: #fea948;
  position: absolute;
  left: unset;
  top: 16px;
  padding: 5px 20px;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  z-index: 2;
  line-height: 1.5;
  color: white;
  font-size: 0.75rem;
`

const RebalanceSash = ({ title, ...props }) => {
  return <RebalanceSashStyle {...props}>{title}</RebalanceSashStyle>
}

export default RebalanceSash
