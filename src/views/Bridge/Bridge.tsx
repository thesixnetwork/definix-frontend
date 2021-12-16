import React from 'react'
import { Box, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'

import ListPageHeader from 'components/ListPageHeader'
import CardBridge from './components/CardBridge'

const Bridge: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <Box maxWidth={`${isMobile ? '100%' : '630px'}`} mx="auto" my={`${isMobile ? 'S_32' : 'S_28'}`}>
      <ListPageHeader type="bridge" />
      <CardBridge isMobile={isMobile} />
    </Box>
  )
}

export default Bridge
