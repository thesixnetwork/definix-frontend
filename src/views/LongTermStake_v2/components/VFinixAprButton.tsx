import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { useLocation } from 'react-router-dom'
import { Flex } from '@fingerlabs/definixswap-uikit-v2'
import { useLockTopup, useAllDataLock } from 'hooks/useLongTermStake'

import AprButtonPc from './AprButtonPc'
import AprButtonMobile from './AprButtonMobile'
import { IsMobileType, DataType } from './types'

interface VFinixProps extends IsMobileType {
  days: number
  setDays: React.Dispatch<React.SetStateAction<number>>
  data: DataType[]
  setPossibleSuperStake: React.Dispatch<React.SetStateAction<boolean>>
}

const VFinixAprButton: React.FC<VFinixProps> = ({ isMobile, days, setDays, data, setPossibleSuperStake }) => {
  const { pathname } = useLocation()
  const [superStakeData, setSuperStakeData] = useState<number[]>([])
  const lockTopUp = useLockTopup()
  const { allLock } = useAllDataLock()

  useEffect(() => {
    const array = []
    if (lockTopUp !== null && lockTopUp.length > 0) {
      const arrStr = lockTopUp.map((i) => Number(i))
      const removeisUnlockedOrisPenalty = allLock.filter(
        (item) => _.get(item, 'isUnlocked') === false && _.get(item, 'isPenalty') === false,
      )

      const removeTopUpId = removeisUnlockedOrisPenalty.filter((item) => !arrStr.includes(Number(_.get(item, 'id'))))
      removeTopUpId.map((r) => {
        return array.push(_.get(r, 'level'))
      })
      setSuperStakeData(array)
    } else {
      const removeisUnlockedOrisPenalty = allLock.filter(
        (item) => _.get(item, 'isUnlocked') === false && _.get(item, 'isPenalty') === false,
      )
      removeisUnlockedOrisPenalty.map((r) => {
        return array.push(_.get(r, 'level'))
      })
      setSuperStakeData(array)
    }

    if (pathname === '/super-stake') {
      const maxDay = Math.max(...array)
      if (maxDay === 1) setDays(90)
      if (maxDay === 2) setDays(180)
      if (maxDay === 3) setDays(365)
    }

    if (array.length !== 0) setPossibleSuperStake(true)
    else setPossibleSuperStake(false)

    return () => setSuperStakeData([])
  }, [lockTopUp, allLock, setDays, setPossibleSuperStake, pathname])

  return (
    <>
      <Flex width="100%">
        {isMobile ? (
          <AprButtonMobile days={days} setDays={setDays} data={data} superStakeData={superStakeData} />
        ) : (
          <AprButtonPc days={days} setDays={setDays} data={data} superStakeData={superStakeData} />
        )}
      </Flex>
    </>
  )
}

export default VFinixAprButton
