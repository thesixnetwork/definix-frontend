import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Divider } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

const StyledFlex = styled(Flex)`
  width: 100%;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.lightGrey20};
`

const StakeListHead: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Divider width="100%" backgroundColor="lightgrey" opacity="0.5" />
      <StyledFlex alignItems="center">
        <Text pl="S_20" width="26%" textStyle="R_12M" color="mediumgrey">
          {t('Long-term Stake')}
        </Text>
        <Text width="22%" textStyle="R_12M" color="mediumgrey">
          {t('Amount')}
        </Text>
        <Text width="52%" textStyle="R_12M" color="mediumgrey">
          {t('Stake End Date')}
        </Text>
      </StyledFlex>
      <Divider width="100%" backgroundColor="lightgrey" opacity="0.5" />
    </>
  )
}

export default StakeListHead
