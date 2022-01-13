import React from 'react'
import {
  Flex,
  Text,
  CheckBIcon,
} from '@fingerlabs/definixswap-uikit-v2'

interface Props {
  label: string;
}

const VoteOptionLabel: React.FC<Props> = ({ label }) => {
  return (
    <Flex alignItems="flex-start">
      <CheckBIcon />
      <Text ml="8px" textStyle="R_14R" color="deepgrey">{label}</Text>
    </Flex>
  )
}

export default VoteOptionLabel
