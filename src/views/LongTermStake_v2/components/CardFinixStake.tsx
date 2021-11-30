import React, { useState } from 'react'
import { Card, Flex } from 'definixswap-uikit'
import styled from 'styled-components'

import VFinixAPR from './VFinixAPR'
import { IsMobileType } from './types'

const FlexCard = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const CardFinixStake: React.FC<IsMobileType> = ({ isMobile }) => {
  const [days, setDays] = useState('365 days')

  return (
    <>
      <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
        <FlexCard>
          <VFinixAPR isMobile={isMobile} days={days} setDays={setDays} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardFinixStake
