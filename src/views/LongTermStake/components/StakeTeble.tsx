/* eslint-disable no-nested-ternary */
import React, { useState, useMemo } from 'react'
import useTheme from 'hooks/useTheme'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import { useLockCount, useAllowance, usePrivateData, useAllLock } from '../../../hooks/useLongTermStake'
import LockVfinixList from './LockVfinixList'
import FinixStakeCard from './FinixStakeCard'

const StakeTable: React.FC = () => {
  // @ts-ignore
  const { isDark } = useTheme()
  const lockCount = useLockCount()
  const [total, setTotal] = useState(lockCount)
  const [isLoading, setIsLoading] = useState(false)
  const { account } = useWallet()
  const allowance = useAllowance()
  const { allDataLock } = usePrivateData()
  useAllLock()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  useMemo(() => {
    if (allDataLock.length !== 0) {
      setTotal(lockCount)
    }
  }, [allDataLock, lockCount])

  return (
    <>
      {isApproved && Number(lockCount) !== 0 && (
        <LockVfinixList total={total} rows={allDataLock} isLoading={isLoading} isDark={isDark} />
      )}
      <FinixStakeCard />
    </>
  )
}

export default StakeTable
