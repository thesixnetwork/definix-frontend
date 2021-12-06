import React from 'react'
import { Card, Flex, Divider, VDivider } from 'definixswap-uikit'
import styled from 'styled-components'

import StakeDayRatio from './StakeDayRatio'
import FinixStake from './FinixStake'
import { IsMobileType } from './types'

const FlexCard = styled(Flex)`
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
  }
`

const CardTotalStake: React.FC<IsMobileType> = ({ isMobile }) => {
  return (
    <>
      <Card p={isMobile ? 'S_20' : 'S_40'}>
        <FlexCard>
          <FinixStake isMobile={isMobile} />
          {isMobile ? <Divider width="100%" backgroundColor="lightGrey50" /> : <VDivider opacity="0.5" />}
          <StakeDayRatio isMobile={isMobile} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardTotalStake
