import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button, FireIcon } from 'definixswap-uikit-v2'
import styled from 'styled-components'

import { IsMobileType } from './types'

interface FinixEarnProps extends IsMobileType {
  finixEarn: number
}

const FlexEarn = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`

const FinixEarn: React.FC<FinixEarnProps> = ({ isMobile, finixEarn }) => {
  const { t } = useTranslation()

  return (
    <>
      <FlexEarn px={isMobile ? 'S_20' : 'S_40'} py={isMobile ? 'S_20' : 'S_32'}>
        <Flex flexDirection="column">
          <Flex mb="S_6" alignItems="center">
            <FireIcon viewBox="0 0 44 44" width="24px" height="24px" />
            <Text ml="S_8" textStyle="R_14M" color="white" style={{ opacity: '0.7' }}>
              {t('Total Finix Earned')}
            </Text>
          </Flex>
          <Flex alignItems="flex-end">
            <Text textStyle="R_20B" color="white">
              {numeral(finixEarn).format('0,0.[000000]')}
            </Text>
            <Text ml="S_6" textStyle="R_16M" color="white">
              {t('FINIX')}
            </Text>
          </Flex>
        </Flex>
        <Button width={`${isMobile ? '100%' : '156px'}`} mt={`${isMobile && 'S_24'}`}>
          {t('Harvest')}
        </Button>
      </FlexEarn>
    </>
  )
}

export default FinixEarn
