import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Flex, TitleSet, ImgPoolIcon, Box } from 'definixswap-uikit'

const ImgWrap = styled(ImgPoolIcon)`
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    display: none;
  }
`

const PoolHeader: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Flex justifyContent="space-between" alignItems="flex-end">
      <Box mb="S_40">
        <TitleSet
          title="Pool"
          description={t('Deposit a single token')}
          linkLabel={t('Learn how to stake')}
          link="https://sixnetwork.gitbook.io/definix-on-klaytn-en/pools/how-to-stake-to-definix-pool"
        />
      </Box>
      <ImgWrap />
    </Flex>
  )
}

export default PoolHeader
