import React from 'react'
import { Flex, Text, CheckBIcon } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

interface Props {
  label: string | React.ReactNode
}

const Label = styled(Text)`
  margin-left: 8px;
  padding-right: 20px;
  ${({ theme }) => theme.textStyle.R_14R}
  color: ${({ theme }) => theme.colors.deepgrey};

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-right: 0;
    width: auto;
  }
`

const VoteOptionLabel: React.FC<Props> = ({ label }) => {
  return (
    <Flex alignItems="flex-start">
      <CheckBIcon
        style={{
          flexShrink: 0,
          marginTop: '2px',
        }}
      />
      <Label>{label}</Label>
    </Flex>
  )
}

export default VoteOptionLabel
