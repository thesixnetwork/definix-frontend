import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button } from 'definixswap-uikit'
import styled from 'styled-components'

import FireIcon from '../../../assets/images/ico-44-fire.png'
import FireIcon2x from '../../../assets/images/ico-44-fire@2x.png'
import FireIcon3x from '../../../assets/images/ico-44-fire@3x.png'

import { IsMobileType } from './types'

const FlexEarn = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`

const FinixEarn: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()

  return (
    <>
      <FlexEarn px={isMobile ? 'S_20' : 'S_40'} py={isMobile ? 'S_20' : 'S_32'}>
        <Flex flexDirection="column">
          <Flex mb="S_6" alignItems="center">
            <img width={24} height={24} src={FireIcon} srcSet={`${FireIcon2x} 2x, ${FireIcon3x} 3x`} alt="fire-icon" />
            <Text ml="S_8" textStyle="R_14M" color="white" style={{ opacity: '0.7' }}>
              {t('Total Finix Earned')}
            </Text>
          </Flex>
          <Flex alignItems="flex-end">
            <Text textStyle="R_20B" color="white">
              100,000,000.123456
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
