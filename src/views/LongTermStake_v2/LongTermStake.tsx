import React from 'react'
import { Box, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'

import styled from 'styled-components'
// import { useTranslation } from 'react-i18next'
import TitleStake from './components/TitleStake'
import CardTotalStake from './components/CardTotalStake'
import CardTotalEarn from './components/CardTotalEarn'
import CardFinixStake from './components/CardFinixStake'
import CardStakeList from './components/CardStakeList'

// import repairImgX1 from '../../assets/images/img_longterm_repair.png'
// import repairImgX2 from '../../assets/images/img_longterm_repair@2x.png'
// import repairImgX3 from '../../assets/images/img_longterm_repair@3x.png'

const Wrap = styled.div`
  position: relative;
`

// const Working = styled(Flex)`
//   background-color: rgba(255, 255, 255, 0.9);
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100%;
//   height: 100%;
//   border-radius: 16px;
//   white-space: pre-line;
//   text-align: center;
//   padding: 40px;
//   padding-top: 140px;
// `

const LongTermStake: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWallet()
  // const { t } = useTranslation()

  return (
    <>
      <Box maxWidth={`${isMobile ? '100%' : '630px'}`} mx="auto" my={`${isMobile ? 'S_32' : 'S_28'}`}>
        <TitleStake />
        <Wrap>
          <CardTotalStake isMobile={isMobile} />
          {!!account && <CardTotalEarn isMobile={isMobile} />}
          <CardFinixStake isMobile={isMobile} />
          {!!account && <CardStakeList isMobile={isMobile} />}
          {/* <Working p="S_32" flexDirection="column" alignItems="center">
            <img alt="" src={repairImgX1} srcSet={`${repairImgX2} x2, ${repairImgX3} x3`} />
            <Text textStyle="R_16M" mb="S_16" mt="30px">
              {t('Still in progress')}
            </Text>
            <Button width="140px" onClick={() => window.open('https://klaytn.definix.com/long-term-stake')}>
              {t('Go to G1')}
            </Button>
          </Working> */}
        </Wrap>
      </Box>
    </>
  )
}

export default LongTermStake
