import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Box, Card, Flex, useMatchBreakpoints, LogoFooterSixIcon } from 'definixswap-uikit'

import TitleBridge from './components/TitleBridge'
import CardBridge from './components/CardBridge'

const Bridge: React.FC = () => {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl

  return (
    <>
      <Helmet>
        <title>Bridge - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Flex justifyContent="center">
        <Box className={isMobile ? 'mt-s32' : 'mt-s28'} width={629}>
          <TitleBridge isMobile={isMobile} />

          <CardBridge isMobile={isMobile} />
        </Box>
      </Flex>
    </>
  )
}

export default Bridge
