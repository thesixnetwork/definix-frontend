import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import { Card, Flex, Text, Divider } from '@fingerlabs/definixswap-uikit-v2'
import { useApr, useAllLock, usePrivateData, useAllowance } from 'hooks/useLongTermStake'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'

import longTermImgX1 from 'assets/images/img-longterm.png'
import longTermImgX2 from 'assets/images/img-longterm@2x.png'
import longTermImgX3 from 'assets/images/img-longterm@3x.png'

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

const Wrap = styled.div`
  position: relative;
`

const Working = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  white-space: pre-line;
  text-align: center;
`

const CardFinixStake: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const [days, setDays] = useState<number>(365)
  const [inputBalance, setInputBalance] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [possibleSuperStake, setPossibleSuperStake] = useState<boolean>(false)
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = _.get(allLockPeriod, '0.minimum')
  const { balancefinix, balancevfinix } = usePrivateData()

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
    return () => setDays(90)
  }, [pathname])

  return (
    <>
      <Card>
        <TabStake isMobile={isMobile} />
        <Wrap>
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

          {!balancevfinix && (
            <Working>
              <img alt="" width={236} src={longTermImgX1} srcSet={`${longTermImgX2} 2x, ${longTermImgX3} 3x`} />
              <Text textStyle="R_18M" mt="S_24">
                {t('You cannot use Super Stake.')}
              </Text>
              <Text textStyle="R_14R" mt="S_12">
                {t('This feature is only for vFINIX holder')}
              </Text>
            </Working>
          )}
        </Wrap>
      </Card>
    </>
  )
}

export default CardFinixStake
