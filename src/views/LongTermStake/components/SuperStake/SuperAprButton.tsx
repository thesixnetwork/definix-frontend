import React, { useState, useEffect } from 'react'
import _ from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Helper } from '@fingerlabs/definixswap-uikit-v2'
import { useLockTopup, useAllDataLock } from 'hooks/useLongTermStake'

import AprButtonPc from './SuperAprButtonPc'
import AprButtonMobile from './SuperAprButtonMobile'
import { IsMobileType, DataType } from '../types'

interface SuperAprButtonProps extends IsMobileType {
  days: number
  setDays: React.Dispatch<React.SetStateAction<number>>
  data: DataType[]
}

const SuperAprButton: React.FC<SuperAprButtonProps> = ({ isMobile, days, setDays, data }) => {
  const { t } = useTranslation()
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

    const maxDay = Math.max(...array)
    if (maxDay === 1) setDays(90)
    if (maxDay === 2) setDays(180)
    if (maxDay === 3) setDays(365)

    return () => setSuperStakeData([])
  }, [lockTopUp, allLock, setDays])

  return (
    <>
      <Flex width="100%" flexDirection="column" mb={isMobile ? 'S_40' : 'S_32'}>
        <Flex mb="S_12">
          <Text textStyle="R_12R" color="mediumgrey" mr="S_4">
            {t('What is Super Stake?')}
          </Text>
          <Helper text={`${t('Super Stake tooltip')}`} />
        </Flex>
        <Flex>
          {isMobile ? (
            <AprButtonMobile days={days} setDays={setDays} data={data} superStakeData={superStakeData} />
          ) : (
            <AprButtonPc days={days} setDays={setDays} data={data} superStakeData={superStakeData} />
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default SuperAprButton
