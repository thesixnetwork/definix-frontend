import React from 'react'
import { Box, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'

import TitleStake from './components/TitleStake'
import CardTotalStake from './components/CardTotalStake'
import CardTotalEarn from './components/CardTotalEarn'
import CardFinixStake from './components/CardFinixStake'
import CardStakeList from './components/CardStakeList'

const LongTermStake: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWallet()

  return (
    <>
      <Box maxWidth={`${isMobile ? '100%' : '630px'}`} mx="auto" my={`${isMobile ? 'S_32' : 'S_28'}`}>
        <TitleStake />
        <CardTotalStake isMobile={isMobile} />
        {!!account && <CardTotalEarn isMobile={isMobile} />}
        <CardFinixStake isMobile={isMobile} />
        {!!account && <CardStakeList isMobile={isMobile} />}
      </Box>
    </>
  )
}

export default LongTermStake
