import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { Box, useMatchBreakpoints } from 'definixswap-uikit'

import TitleBridge from './components/TitleBridge'
import CardBridge from './components/CardBridge'

const MaxWidth = styled.div<{ isMobile: string }>`
  max-width: ${(props) => props.isMobile};
  margin-left: auto;
  margin-right: auto;
`

const Bridge: React.FC = () => {
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl

  return (
    <>
      <Helmet>
        <title>Bridge - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <MaxWidth isMobile={`${isMobile ? '100%' : '630px'}`}>
        <Box className={`${isMobile ? 'my-s32' : 'my-s28'} `} width="100%">
          <TitleBridge isMobile={isMobile} />
          <CardBridge isMobile={isMobile} />
        </Box>
      </MaxWidth>
    </>
  )
}

export default Bridge
