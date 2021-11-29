import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, useMatchBreakpoints } from 'definixswap-uikit'

import TitleStake from './components/TitleStake'
import CardTotalStake from './components/CardTotalStake'

const LongTermStake: React.FC = () => {
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl

  return (
    <>
      <Helmet>
        <title>Long-term Stake - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Box maxWidth={`${isMobile ? '100%' : '630px'}`} mx="auto" my={`${isMobile ? 'S_32' : 'S_28'}`}>
        <TitleStake isMobile={isMobile} />
        <CardTotalStake isMobile={isMobile} />
      </Box>
    </>
  )
}

export default LongTermStake
