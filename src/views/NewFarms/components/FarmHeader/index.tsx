import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Flex, TitleSet, ImgFarmIcon, Box } from 'definixswap-uikit'

const ImgWrap = styled(ImgFarmIcon)`
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    display: none;
  }
`

const FarmHeader: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Flex justifyContent="space-between" alignItems="flex-end">
      <Box mb="S_40">
        <TitleSet
          title="Farm"
          description={t('Pairing coins to create LP')}
          linkLabel={t('Learn how to stake in Farm')}
          link="https://sixnetwork.gitbook.io/definix-on-klaytn-en/yield-farming/how-to-yield-farm-on-definix"
        />
      </Box>
      <ImgWrap />
    </Flex>
  )
}

export default FarmHeader
