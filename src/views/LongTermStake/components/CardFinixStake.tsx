import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { Card, Flex, Text, Divider } from '@fingerlabs/definixswap-uikit-v2'
import { useApr, useAllLock, usePrivateData, useAllowance } from 'hooks/useLongTermStake'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'
import moment from 'moment'

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

type SelectedSuperStakOption = {
  multiple?: number
  day?: number
  endDay?: string
  apr?: number
  minStake?: number
  level?: number
}

const CardFinixStake: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const [selectedSuperStakOption, setSelectedSuperStakOption] = useState<SelectedSuperStakOption>({})
  const [inputBalance, setInputBalance] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [possibleSuperStake, setPossibleSuperStake] = useState<boolean>(false)
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = get(allLockPeriod, '0.minimum')
  const { balancefinix, balancevfinix, allDataLock } = usePrivateData()

  const { account } = useWallet()
  const allowance = useAllowance()
  const hasAccount = useMemo(() => !!account, [account])

  const [isApproved, setIsApproved] = useState<boolean>(false) 
  
  const getEndDay = (level) => {
    const myPeriodSuperStakes = allDataLock.filter(
      (e) => get(e, 'isTopup') && !get(e, 'isUnlocked') && !get(e, 'isPenalty') && level === get(e, 'level'),
    )

    const levelByDay = {
      1: 90,
      2: 180,
      3: 365,
    }
    let day
    if (myPeriodSuperStakes) {
      myPeriodSuperStakes.forEach((e) => {
        const topupTimeStamp = get(e, 'topupTimeStamp')
        const lockTimestamp = get(e, 'lockTimestamp')
        if (
          moment(topupTimeStamp).diff(moment(), 'milliseconds') > 0 &&
          moment(lockTimestamp).diff(moment(), 'milliseconds') > 0
        ) {
          day = moment(lockTimestamp)
        }
      })
    }
    return (day || moment().add(levelByDay[level], 'days')).format(
      i18n.language === 'ko' ? `YYYY-MM-DD HH:mm:ss` : `DD-MMM-YYYY HH:mm:ss`,
    )
  }

  const data = [
    {
      multiple: 1,
      day: 90,
      endDay: getEndDay(1),
      apr: apr * 1,
      minStake: get(minimum, '0'),
      level: 1,
    },
    {
      multiple: 2,
      day: 180,
      endDay: getEndDay(2),
      apr: apr * 2,
      minStake: get(minimum, '1'),
      level: 2,
    },
    {
      multiple: 4,
      day: 365,
      endDay: getEndDay(3),
      apr: apr * 4,
      minStake: get(minimum, '2'),
      level: 3,
    },
  ]



  useEffect(() => {
    if(account && allowance && allowance.isGreaterThan(0)) {
      // setIsApproved(true);
    }
  }, [account, allowance])

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

  return (
    <>
      <Card>
        <TabStake isMobile={isMobile} />
        <Wrap>
          <FlexCard p={isMobile ? 'S_20' : 'S_40'} pt={pathname.indexOf('super') > -1 && 'S_32'}>
            <AprButton
              isMobile={isMobile}
              days={selectedSuperStakOption?.day}
              setSelectedSuperStakOption={setSelectedSuperStakOption}
              data={data}
              setPossibleSuperStake={setPossibleSuperStake}
            />
            {isMobile && <Divider width="100%" backgroundColor="lightGrey50" />}
            <BalanceFinix
              hasAccount={hasAccount}
              minimum={data.find((item) => item.day === selectedSuperStakOption?.day)?.minStake}
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
              setIsApproved={setIsApproved}
              inputBalance={inputBalance}
              setInputBalance={setInputBalance}
              days={selectedSuperStakOption?.day}
              earn={getVFinix(selectedSuperStakOption?.day, inputBalance)}
              isError={!!error}
              possibleSuperStake={possibleSuperStake}
            />
            <EstimateVFinix
              hasAccount={hasAccount}
              endDay={selectedSuperStakOption?.endDay}
              earn={getVFinix(selectedSuperStakOption?.day, inputBalance)}
            />
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
