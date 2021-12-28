import React from 'react'
import { Card, Box, Flex, Text, Button, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'

import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

// import repairImgX1 from '../../assets/images/img_longterm_repair.png'
// import repairImgX2 from '../../assets/images/img_longterm_repair@2x.png'
import repairImgX3 from '../../assets/images/img_longterm_repair@3x.png'

import TitleStake from './components/TitleStake'
import TabStake from './components/TabStake'

const Wrap = styled.div`
  position: relative;
  height: 560px;
`

const Working = styled(Flex)`
  background-color: rgba(255, 255, 255, 0.9);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  white-space: pre-line;
  text-align: center;
  padding: 40px;
  padding-top: 140px;
`

const SuperStake: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()

  return (
    <>
      <Box
        maxWidth={`${isMobile ? '100%' : '630px'}`}
        mx="auto"
        mt={`${isMobile ? 'S_32' : 'S_28'}`}
        mb={`${isMobile ? 'S_40' : 'S_80'}`}
      >
        <TitleStake />

        <Card>
          <TabStake isMobile={isMobile} />
          <Wrap>
            <Working p="S_32" flexDirection="column" alignItems="center">
              <img alt="" width={236} src={repairImgX3} />
              <Text textStyle="R_16M" mb="S_16" mt="30px">
                {t('still in progress super stake')}
              </Text>
              <Button width="140px" onClick={() => window.open('https://klaytn.definix.com/long-term-stake/top-up')}>
                {t('Go to G1')}
              </Button>
            </Working>
          </Wrap>
        </Card>
      </Box>
    </>
  )
}

export default SuperStake
