import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, useMatchBreakpoints } from 'definixswap-uikit-v2'

import TitleBridge from './components/TitleBridge'
import CardBridge from './components/CardBridge'

const Bridge: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <Helmet>
        <title>Bridge - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Box maxWidth={`${isMobile ? '100%' : '630px'}`} mx="auto" my={`${isMobile ? 'S_32' : 'S_28'}`}>
        <TitleBridge isMobile={isMobile} />
        <CardBridge isMobile={isMobile} />
      </Box>
    </>
  )
}

export default Bridge
