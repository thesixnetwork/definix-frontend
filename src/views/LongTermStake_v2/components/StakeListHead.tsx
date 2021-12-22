import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Divider } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

const StyledFlex = styled(Flex)`
  width: 100%;
  padding-bottom: 8px;
`

const StakeListHead: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <StyledFlex>
        <Text width="20%" textStyle="R_14R" color="mediumgrey">
          {t('Stake Period')}
        </Text>
        <Text width="27%" textStyle="R_14R" color="mediumgrey">
          {t('Amount')}
        </Text>
        <Text width="53%" textStyle="R_14R" color="mediumgrey">
          {t('Period End')}
        </Text>
      </StyledFlex>
      <Divider width="100%" backgroundColor="lightgrey" />
    </>
  )
}

export default StakeListHead
