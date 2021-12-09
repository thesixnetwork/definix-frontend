import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'
import { Card, Flex, Divider } from 'definixswap-uikit-v2'
import { useApr, useAllLock } from '../../../hooks/useLongTermStake'

import VFinixAprButton from './VFinixAprButton'
import BalanceFinix from './BalanceFinix'
import ApproveFinix from './ApproveFinix'
import EstimateVFinix from './EstimateVFinix'
import { IsMobileType } from './types'

interface CardFinixStakeProps extends IsMobileType {
  account: string
}

const FlexCard = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const CardFinixStake: React.FC<CardFinixStakeProps> = ({ isMobile, account }) => {
  const [days, setDays] = useState<number>(365)
  const [inputBalance, setInputBalance] = useState<string>('')
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = _.get(allLockPeriod, '0.minimum')
  const today = new Date()
  const endDay = moment(today.setDate(today.getDate() + days)).format(`DD-MMM-YYYY HH:mm:ss`)

  const data = [
    {
      multiple: 1,
      day: 90,
      apr: apr * 1,
      minStake: _.get(minimum, '0'),
    },
    {
      multiple: 2,
      day: 180,
      apr: apr * 2,
      minStake: _.get(minimum, '1'),
    },
    {
      multiple: 4,
      day: 365,
      apr: apr * 4,
      minStake: _.get(minimum, '2'),
    },
  ]

  return (
    <>
      <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
        <FlexCard>
          <VFinixAprButton isMobile={isMobile} days={days} setDays={setDays} data={data} />
          {isMobile && <Divider width="100%" backgroundColor="lightGrey50" />}
          <BalanceFinix days={days} data={data} inputBalance={inputBalance} setInputBalance={setInputBalance} />
          <Divider width="100%" backgroundColor="lightGrey50" />
          <ApproveFinix isMobile={isMobile} account={account} />
          <EstimateVFinix days={days} inputBalance={inputBalance} endDay={endDay} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardFinixStake
