import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import { Card, Flex, Divider } from '@fingerlabs/definixswap-uikit-v2'
import { useApr, useAllLock, usePrivateData } from 'hooks/useLongTermStake'

import VFinixAprButton from './VFinixAprButton'
import BalanceFinix from './BalanceFinix'
import ApproveFinix from './ApproveFinix'
import EstimateVFinix from './EstimateVFinix'
import { IsMobileType } from './types'

interface CardFinixStakeProps extends IsMobileType {
  hasAccount: boolean
}

const FlexCard = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const CardFinixStake: React.FC<CardFinixStakeProps> = ({ isMobile, hasAccount }) => {
  const [days, setDays] = useState<number>(365)
  const [inputBalance, setInputBalance] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [approve] = useState<boolean>(true)
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = _.get(allLockPeriod, '0.minimum')
  const today = new Date()
  const endDay = moment(today.setDate(today.getDate() + days)).format(`DD-MMM-YYYY HH:mm:ss`)
  const { balancefinix } = usePrivateData()

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

  const getVFinix = (day: number, balance: string) => {
    if (!balance) return 0

    switch (day) {
      case 90:
        return numeral(Number(balance)).format('0,0.[000000]')
      case 180:
        return numeral(Number(balance) * 2).format('0,0.[000000]')
      case 365:
        return numeral(Number(balance) * 4).format('0,0.[000000]')
      default:
        return 0
    }
  }

  return (
    <>
      <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
        <FlexCard>
          <VFinixAprButton isMobile={isMobile} days={days} setDays={setDays} data={data} />
          {isMobile && <Divider width="100%" backgroundColor="lightGrey50" />}
          <BalanceFinix
            hasAccount={hasAccount}
            approve={approve}
            minimum={data.find((item) => item.day === days).minStake}
            inputBalance={inputBalance}
            setInputBalance={setInputBalance}
            error={error}
            setError={setError}
            balancefinix={balancefinix}
          />
          <ApproveFinix
            isMobile={isMobile}
            hasAccount={hasAccount}
            approve={approve}
            inputBalance={inputBalance}
            days={days}
            endDay={endDay}
            earn={getVFinix(days, inputBalance)}
            isError={!!error}
          />
          <EstimateVFinix hasAccount={hasAccount} endDay={endDay} earn={getVFinix(days, inputBalance)} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardFinixStake
