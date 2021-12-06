import React, { useState } from 'react'
import { Card, Flex, Divider } from 'definixswap-uikit'
import styled from 'styled-components'

import VFinixAprButton from './VFinixAprButton'
import BalanceFinix from './BalanceFinix'
import ApproveFinix from './ApproveFinix'
import EstimateVFinix from './EstimateVFinix'
import { IsMobileType } from './types'

const FlexCard = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const CardFinixStake: React.FC<IsMobileType> = ({ isMobile }) => {
  const [days, setDays] = useState('365 days')

  const data = [
    {
      multiple: '1X',
      day: '90 days',
      apr: '27.69',
      minStake: '1,000',
    },
    {
      multiple: '2X',
      day: '180 days',
      apr: '55.30',
      minStake: '10,000',
    },
    {
      multiple: '4X',
      day: '365 days',
      apr: '110.76',
      minStake: '30,000',
    },
  ]

  return (
    <>
      <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
        <FlexCard>
          <VFinixAprButton isMobile={isMobile} days={days} setDays={setDays} data={data} />
          {isMobile && <Divider width="100%" backgroundColor="lightGrey50" />}
          <BalanceFinix isMobile={isMobile} days={days} data={data} />
          <Divider width="100%" backgroundColor="lightGrey50" />
          <ApproveFinix isMobile={isMobile} />
          <EstimateVFinix isMobile={isMobile} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardFinixStake
