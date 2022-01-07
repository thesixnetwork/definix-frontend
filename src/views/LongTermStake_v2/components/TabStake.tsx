import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

import { IsMobileType } from './types'

const Tabs = styled(Flex)`
  position: relative;
  width: 100%;
  border-bottom: ${({ theme }) => `2px solid ${theme.colors.lightGrey50}`};
`

const Tab = styled(Link)<{ $mobile: boolean; $isSelected?: boolean }>`
  position: relative;
  width: ${({ $mobile }) => ($mobile ? '50%' : 'auto')};
  height: ${({ $mobile }) => ($mobile ? '56px' : '66px')};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 ${({ $mobile }) => ($mobile ? '0px' : '48px')};
  text-align: center;
`

const StyledText = styled(Text)<{ $mobile: boolean; $isSelected?: boolean }>`
  ${({ $mobile, theme }) => ($mobile ? theme.textStyle.R_16B : theme.textStyle.R_14B)}
  color : ${({ $isSelected, theme }) => ($isSelected ? theme.colors.black : theme.colors.mediumgrey)};
`

const StyledBorderBottom = styled.div<{ $isSelected?: boolean }>`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.black : 'transparent')};
  opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0.4)};
`

const TabStake: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  return (
    <Tabs height={`${isMobile ? '56px' : '66px'}`}>
      <Tab to="/long-term-stake" $mobile={isMobile} $isSelected={pathname === '/long-term-stake'}>
        <StyledText $mobile={isMobile} $isSelected={pathname === '/long-term-stake'}>
          {t('Long-term Stake')}
        </StyledText>
        <StyledBorderBottom $isSelected={pathname === '/long-term-stake'} />
      </Tab>
      <Tab to="/long-term-stake/super" $mobile={isMobile} $isSelected={pathname.indexOf('super') > -1}>
        <StyledText $mobile={isMobile} $isSelected={pathname.indexOf('super') > -1}>
          {t('Super Stake')}
        </StyledText>
        <StyledBorderBottom $isSelected={pathname.indexOf('super') > -1} />
      </Tab>
    </Tabs>
  )
}

export default TabStake
