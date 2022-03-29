import React, { useState, useEffect, useMemo } from 'react'
import { get } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Flex, Text, Helper } from '@fingerlabs/definixswap-uikit-v2'
import { useLockTopup, useAllDataLock } from 'hooks/useLongTermStake'

import AprButtonPc from './AprButtonPc'
import AprButtonMobile from './AprButtonMobile'
import { IsMobileType, DataType } from './types'

interface VFinixProps extends IsMobileType {
  days: number
  setSelectedSuperStakOption: any
  data: DataType[]
  setPossibleSuperStake: React.Dispatch<React.SetStateAction<boolean>>
}

const AprButton: React.FC<VFinixProps> = ({
  isMobile,
  days,
  setSelectedSuperStakOption,
  data,
  setPossibleSuperStake,
}) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isSuperStake = useMemo(() => pathname.indexOf('super') > -1, [pathname])
  const [superStakeData, setSuperStakeData] = useState<number[]>([])
  const lockTopUp = useLockTopup()
  const { allLock } = useAllDataLock()

  useEffect(() => {
    const array = []
    if (lockTopUp !== null && lockTopUp.length > 0) {
      const arrStr = lockTopUp.map((i) => Number(i))
      const removeisUnlockedOrisPenalty = allLock.filter(
        (item) => get(item, 'isUnlocked') === false && get(item, 'isPenalty') === false,
      )

      const removeTopUpId = removeisUnlockedOrisPenalty.filter((item) => !arrStr.includes(Number(get(item, 'id'))))
      removeTopUpId.map((r) => {
        return array.push(get(r, 'level'))
      })
      setSuperStakeData(array)
    } else {
      const removeisUnlockedOrisPenalty = allLock.filter(
        (item) => get(item, 'isUnlocked') === false && get(item, 'isPenalty') === false,
      )
      removeisUnlockedOrisPenalty.map((r) => {
        return array.push(get(r, 'level'))
      })
      setSuperStakeData(array)
    }

    const maxDay = Math.max(...array)
    if(data[maxDay - 1]) {
      setSelectedSuperStakOption(data[maxDay - 1])
    } else {
      setSelectedSuperStakOption(data[2])
    }

    if (array.length !== 0) setPossibleSuperStake(true)
    else setPossibleSuperStake(false)

    return () => setSuperStakeData([])
  }, [lockTopUp, allLock, setSelectedSuperStakOption, data, setPossibleSuperStake, isSuperStake])

  return (
    <>
      <Flex width="100%" flexDirection="column">
        {isSuperStake && (
          <Flex mb="S_16">
            <Text textStyle="R_14R" color="black" mr="S_4">
              {t('What is Super Stake?')}
            </Text>
            <Helper text={`${t('Super Stake tooltip')}`} />
          </Flex>
        )}
        <Flex>
          {isMobile ? (
            <AprButtonMobile
              days={days}
              setSelectedSuperStakOption={setSelectedSuperStakOption}
              data={data}
              superStakeData={superStakeData}
            />
          ) : (
            <AprButtonPc
              days={days}
              setSelectedSuperStakOption={setSelectedSuperStakOption}
              data={data}
              superStakeData={superStakeData}
            />
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default AprButton
