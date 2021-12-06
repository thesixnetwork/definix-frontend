import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Divider, VDivider } from 'definixswap-uikit'
import styled from 'styled-components'

import { IsMobileType } from './types'

const FlexBalance = styled(Flex)`
  flex-direction: row;
  align-items: flex-end;
  background-color: ${({ theme }) => theme.colors.black20};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding: 24px 40px 32px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }
`

const FlexFinix = styled(Flex)`
  width: 50%;
  height: 55px;
  flex-direction: column;
  justify-content: center;

  &:last-child {
    padding-left: 40px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
    height: auto;

    &:first-child {
      padding-bottom: 16px;
    }
    &:last-child {
      padding-top: 16px;
      padding-left: 0;
    }
  }
`

const MyBalance: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()

  return (
    <>
      <FlexBalance>
        <FlexFinix>
          <Text mb="S_6" textStyle={`${isMobile ? 'R_12R' : 'R_14R'}`} color="mediumgrey">
            {t('Your vFINIX Balance')}
          </Text>
          <Flex alignItems="center">
            <Text textStyle={`${isMobile ? 'R_16B' : 'R_16M'}`} color="white">
              100,000,000.123456
            </Text>
            <Text ml="S_6" textStyle="R_12B" color="white">
              {t('vFINIX')}
            </Text>
          </Flex>
        </FlexFinix>
        {isMobile ? <Divider width="100%" color="brown" /> : <VDivider color="brown" />}
        <FlexFinix>
          <Text mb="S_6" textStyle={`${isMobile ? 'R_12R' : 'R_14R'}`} color="mediumgrey">
            {t('Your Total FINIX Stake')}
          </Text>
          <Flex alignItems="center">
            <Text textStyle={`${isMobile ? 'R_16B' : 'R_16M'}`} color="white">
              100,000,000.123456
            </Text>
            <Text ml="S_6" textStyle="R_12B" color="white">
              {t('FINIX')}
            </Text>
          </Flex>
        </FlexFinix>
      </FlexBalance>
    </>
  )
}

export default MyBalance
