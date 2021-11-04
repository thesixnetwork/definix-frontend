import React from 'react'
import { Box, Text, Toggle, Flex, ColorStyles } from 'definixswap-uikit'

const PoolTabButtons = ({ stackedOnly, setStackedOnly, liveOnly, setLiveOnly }) => {
  return (
    <Box className="mt-s40">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Flex alignItems="center">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              Staked Only
            </Text>
            <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
          </Flex>
          <Flex alignItems="center" className="ml-s24">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              Finished
            </Text>
            <Toggle checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
          </Flex>
        </Flex>
        <Box>search box</Box>
      </Flex>
    </Box>
  )
}

export default PoolTabButtons
