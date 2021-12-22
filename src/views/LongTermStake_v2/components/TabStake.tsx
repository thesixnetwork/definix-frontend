import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

import { IsMobileType } from './types'

interface TabStakeProps extends IsMobileType {
  superStake?: boolean
}

const Wrap = styled(Flex)`
  position: relative;
  border-bottom: 2px solid #e0e0e066;
`

const Tabs = styled(Flex)`
  position: relative;
  width: 100%;
`

const Tab = styled(Link)<{ $mobile: boolean; $focus?: boolean }>`
  width: ${({ $mobile }) => ($mobile ? '50%' : 'auto')};
  height: ${({ $mobile }) => ($mobile ? '56px' : '66px')};
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: ${({ $focus }) => ($focus ? '2px solid #53515f' : 'none')};
  padding: 0 ${({ $mobile }) => ($mobile ? '24px' : '48px')};
  text-align: center;
`

const TabStake: React.FC<TabStakeProps> = ({ isMobile, superStake }) => {
  const { t } = useTranslation()

  return (
    <Wrap height={`${isMobile ? '56px' : '66px'}`}>
      <Tabs>
        <Tab to="long-term-stake" $mobile={isMobile} $focus={!superStake}>
          <Text textStyle={`${isMobile ? 'R_16B' : 'R_14B'}`} color={`${superStake ? 'mediumgrey' : 'black'}`}>
            {t('Long-term Stake')}
          </Text>
        </Tab>
        <Tab to="super-stake" $mobile={isMobile} $focus={superStake}>
          <Text textStyle={`${isMobile ? 'R_16B' : 'R_14B'}`} color={`${superStake ? 'black' : 'mediumgrey'}`}>
            {t('Super Stake')}
          </Text>
        </Tab>
      </Tabs>
    </Wrap>
  )
}

export default TabStake
