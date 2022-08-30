import styled from 'styled-components'
import React from 'react'
import { Box } from '@mui/material'
import listNewImg from '../../../uikit-dev/images/for-ui-v2/badge/new-badge.png'

const PartnerPoolSash = styled.div<{ type?: string }>`
  background-image: url(${listNewImg});
  background-repeat: no-repeat;
  background-size: contain;
  height: 70px;
  width: 70px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.xs} {
    height: 60px;
    width: 60px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 70px;
    width: 70px;
  }
`

const PartnerPoolSashStyle = styled(Box)`
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

export const PartnerPoolSashTitle = ({ title, ...props }) => {
  return <PartnerPoolSashStyle {...props}>{title}</PartnerPoolSashStyle>
}

export default PartnerPoolSash
