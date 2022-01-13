import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Divider, VDivider } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'

import { IsMobileType } from './types'

interface MyBalanceProps extends IsMobileType {
  lockAmount: number
  balancevfinix: number
}

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

const MyBalance: React.FC<MyBalanceProps> = ({ isMobile, lockAmount, balancevfinix }) => {
  const { t } = useTranslation()

  return (
    <>
      <FlexBalance>
        <FlexFinix>
          <Text mb={`${isMobile ? 'S_2' : 'S_6'}`} textStyle={`${isMobile ? 'R_12R' : 'R_14R'}`} color="mediumgrey">
            {t('vFINIX Earn')}
          </Text>
          <Flex alignItems="flex-end">
            <Text textStyle={`${isMobile ? 'R_16B' : 'R_16M'}`} color="white">
              {getBalanceOverBillion(balancevfinix)}
            </Text>
            <Text ml="S_6" mb="S_2" textStyle="R_12B" color="white">
              {t('vFINIX')}
            </Text>
          </Flex>
        </FlexFinix>
        {isMobile ? <Divider width="100%" color="brown" /> : <VDivider color="brown" />}
        <FlexFinix>
          <Text mb={`${isMobile ? 'S_2' : 'S_6'}`} textStyle={`${isMobile ? 'R_12R' : 'R_14R'}`} color="mediumgrey">
            {t('Your Total FINIX Stake')}
          </Text>
          <Flex alignItems="flex-end">
            <Text textStyle={`${isMobile ? 'R_16B' : 'R_16M'}`} color="white">
              {getBalanceOverBillion(lockAmount)}
            </Text>
            <Text ml="S_6" mb="S_2" textStyle="R_12B" color="white">
              {t('FINIX')}
            </Text>
          </Flex>
        </FlexFinix>
      </FlexBalance>
    </>
  )
}

export default MyBalance
