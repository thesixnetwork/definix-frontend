import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { Card, Flex, Text, Divider } from '@fingerlabs/definixswap-uikit-v2'
import { useApr, useAllLock, usePrivateData, useAllowance } from 'hooks/useLongTermStake'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'

import longTermImgX1 from 'assets/images/img-longterm.png'
import longTermImgX2 from 'assets/images/img-longterm@2x.png'
import longTermImgX3 from 'assets/images/img-longterm@3x.png'

import useWallet from 'hooks/useWallet'
import TabStake from './TabStake'
import AprButton from './AprButton'
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
  background-color: rgba(255, 255, 255, 1);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  white-space: pre-line;
  text-align: center;
  padding: 0 20px;
`

const CardFinixStake: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [days, setDays] = useState<number>(365)
  const [inputBalance, setInputBalance] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [possibleSuperStake, setPossibleSuperStake] = useState<boolean>(false)
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = get(allLockPeriod, '0.minimum')
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
      minStake: get(minimum, '0'),
      level: 1,
    },
    {
      multiple: 2,
      day: 180,
      apr: apr * 2,
      minStake: get(minimum, '1'),
      level: 2,
    },
    {
      multiple: 4,
      day: 365,
      apr: apr * 4,
      minStake: get(minimum, '2'),
      level: 3,
    },
  ]

  const getVFinix = (day: number, balance: string) => {
    if (!balance) return 0

    switch (day) {
      case 90:
        return getBalanceOverBillion(Number(balance))
      case 180:
        return getBalanceOverBillion(Number(balance) * 2)
      case 365:
        return getBalanceOverBillion(Number(balance) * 4)
      default:
        return 0
    }
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
          <FlexCard p={isMobile ? 'S_20' : 'S_40'} pt={pathname.indexOf('super') > -1 && 'S_32'}>
            <AprButton
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
              earn={getVFinix(days, inputBalance)}
              isError={!!error}
              possibleSuperStake={possibleSuperStake}
            />
            <EstimateVFinix hasAccount={hasAccount} days={days} earn={getVFinix(days, inputBalance)} />
          </FlexCard>

          {pathname.indexOf('super') > -1 && (!hasAccount || !balancevfinix) && (
            <Working>
              <img
                alt=""
                width={isMobile ? 200 : 236}
                src={longTermImgX1}
                srcSet={`${longTermImgX2} 2x, ${longTermImgX3} 3x`}
              />
              <Text textStyle={isMobile ? 'R_16M' : 'R_18M'} mt="S_24">
                {t('You cannot use Super Stake.')}
              </Text>
              <Text textStyle="R_14R" mt="S_12" color="deepgrey">
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