import React, { useMemo } from 'react'
import { Box, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'

import useWallet from 'hooks/useWallet'
import TitleStake from './components/TitleStake'
import CardTotalStake from './components/CardTotalStake'
import CardTotalEarn from './components/CardTotalEarn'
import CardFinixStake from './components/CardFinixStake'
import CardStakeList from './components/CardStakeList'

const LongTermStake: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWallet()
  const hasAccount = useMemo(() => !!account, [account])
  
  return (
    <>
      <Box
        maxWidth={`${isMobile ? '100%' : '630px'}`}
        mx="auto"
        mt={`${isMobile ? 'S_32' : 'S_28'}`}
        mb={`${isMobile ? 'S_40' : 'S_80'}`}
      >
        <TitleStake />
        <CardFinixStake isMobile={isMobile}/>
        {hasAccount && <CardTotalEarn isMobile={isMobile} />}
        {hasAccount && <CardStakeList isMobile={isMobile} />}
        <CardTotalStake isMobile={isMobile} />
      </Box>
    </>
  )
}

export default LongTermStake
