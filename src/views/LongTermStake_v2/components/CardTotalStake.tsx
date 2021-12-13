import React from 'react'
import styled from 'styled-components'
import { Card, Flex, Divider, VDivider } from 'definixswap-uikit-v2'
import { useTotalFinixLock, useUnstakeId } from 'hooks/useLongTermStake'

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
  const getTotalFinixLock = useTotalFinixLock()
  const { totalFinixLock, totalSupplyAllTimeMint } = useUnstakeId()

  return (
    <>
      <Card p={isMobile ? 'S_20' : 'S_40'}>
        <FlexCard>
          <FinixStake
            isMobile={isMobile}
            totalFinixLock={totalFinixLock}
            totalSupplyAllTimeMint={totalSupplyAllTimeMint}
          />
          {isMobile ? (
            <Divider width="100%" backgroundColor="lightGrey50" />
          ) : (
            <VDivider opacity="0.5" color="lightgrey" />
          )}
          <StakeDayRatio isMobile={isMobile} getTotalFinixLock={getTotalFinixLock} totalFinixLock={totalFinixLock} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardTotalStake
