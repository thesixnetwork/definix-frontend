import React from 'react'
import {
  Flex,
  Text,
  CheckBIcon,
} from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

interface Props {
  label: string | React.ReactNode;
}

const Label = styled(Text)`
  width: 320px;
  margin-left: 8px;
  ${({ theme }) => theme.textStyle.R_14R}
  color: ${({ theme }) => theme.colors.deepgrey};

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: auto;
  }
`

const VoteOptionLabel: React.FC<Props> = ({ label }) => {
  return (
    <Flex alignItems="flex-start">
      <CheckBIcon />
      <Label>{label}</Label>
    </Flex>
  )
}

export default VoteOptionLabel
