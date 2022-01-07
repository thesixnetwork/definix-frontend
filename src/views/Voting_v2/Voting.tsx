import React from 'react'
import { Box, useMatchBreakpoints, TitleSet, Flex, Card, ImageSet, Text, ImgLongtermRepair1x, ImgLongtermRepair2x, ImgLongtermRepair3x, Button } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'

// import CardTotalStake from './components/CardTotalStake'
// import CardTotalEarn from './components/CardTotalEarn'
// import CardFinixStake from './components/CardFinixStake'
// import CardStakeList from './components/CardStakeList'

const Voting: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()

  return (
    <>
      <Box
        maxWidth="100%"
        mx="auto"
        mt={`${isMobile ? 'S_32' : 'S_28'}`}
        mb={`${isMobile ? 'S_40' : 'S_80'}`}
      >
        <Flex mb="S_40">
          <TitleSet
            title={t('Voting')}
            description={t('Drive forward together')}
          />
        </Flex>
        <Card>
          <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="120px" mb="130px">
            <ImageSet srcSet={[ImgLongtermRepair1x, ImgLongtermRepair2x, ImgLongtermRepair3x]} alt="" width={236} height={147} />
            <Text textStyle="R_14R" color="black" mt="43px" textAlign="center">{t("still in progress")}</Text>
            <Button mt="24px" minWidth="146px" onClick={() => window.open('https://klaytn.definix.com/voting', '_blank')}>{t("Go to G1")}</Button>
          </Flex>
        </Card>
      </Box>
    </>
  )
}

export default Voting
