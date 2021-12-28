import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import { Card, Flex, Divider } from '@fingerlabs/definixswap-uikit-v2'
import { useApr, useAllLock, usePrivateData, useAllowance } from 'hooks/useLongTermStake'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'

import TabStake from './TabStake'
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
  const { i18n } = useTranslation()
  const { pathname } = useLocation()
  const [days, setDays] = useState<number>(365)
  const [inputBalance, setInputBalance] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [possibleSuperStake, setPossibleSuperStake] = useState<boolean>(false)
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = _.get(allLockPeriod, '0.minimum')
  const { balancefinix } = usePrivateData()

  const { account } = useWallet()
  const allowance = useAllowance()
  const hasAccount = useMemo(() => !!account, [account])
  const isApproved = useMemo(() => account && allowance && allowance.isGreaterThan(0), [account, allowance])

  const data = [
    {
      multiple: 1,
      day: 90,
      apr: apr * 1,
      minStake: _.get(minimum, '0'),
      level: 1,
    },
    {
      multiple: 2,
      day: 180,
      apr: apr * 2,
      minStake: _.get(minimum, '1'),
      level: 2,
    },
    {
      multiple: 4,
      day: 365,
      apr: apr * 4,
      minStake: _.get(minimum, '2'),
      level: 3,
    },
  ]

  const getVFinix = (day: number, balance: string) => {
    if (!balance) return 0

    switch (day) {
      case 90:
        return numeral(Number(balance)).format('0,0.[00]')
      case 180:
        return numeral(Number(balance) * 2).format('0,0.[00]')
      case 365:
        return numeral(Number(balance) * 4).format('0,0.[00]')
      default:
        return 0
    }
  }

  const getEndDay = () => {
    const today = new Date()

    if (i18n.language === 'ko') {
      return moment(today.setDate(today.getDate() + days)).format(`YYYY-MM-DD HH:mm:ss`)
    }
    return moment(today.setDate(today.getDate() + days)).format(`DD-MMM-YYYY HH:mm:ss`)
  }

  useEffect(() => {
    if (pathname === '/long-term-stake') setDays(365)
  }, [pathname])

  return (
    <>
      <Card>
        <TabStake isMobile={isMobile} />
        <FlexCard p={isMobile ? 'S_20' : 'S_40'}>
          <VFinixAprButton
            isMobile={isMobile}
            days={days}
            setDays={setDays}
            data={data}
            setPossibleSuperStake={setPossibleSuperStake}
          />
          {isMobile && <Divider width="100%" backgroundColor="lightGrey50" />}
          <BalanceFinix
            hasAccount={hasAccount}
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
            isApproved={isApproved}
            inputBalance={inputBalance}
            setInputBalance={setInputBalance}
            days={days}
            endDay={getEndDay()}
            earn={getVFinix(days, inputBalance)}
            isError={!!error}
            possibleSuperStake={possibleSuperStake}
          />
          <EstimateVFinix hasAccount={hasAccount} endDay={getEndDay()} earn={getVFinix(days, inputBalance)} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardFinixStake
