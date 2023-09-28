import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
} from 'state/actions'
import { unstake, unstakeVelo, sousUnstake, sousEmegencyUnstake } from 'utils/callHelpers'
import { useHerodotus, useSousChef, useVeloPool } from './useContract'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const herodotusContract = useHerodotus()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(herodotusContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
      return txHash
    },
    [account, dispatch, herodotusContract, pid],
  )

  return { onUnstake: handleUnstake }
}

const SYRUPIDS = []

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const herodotusContract = useHerodotus()
  const sousChefContract = useSousChef(sousId)
  const isOldSyrup = SYRUPIDS.includes(sousId)

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (sousId === 0 || sousId === 25) {
        const txHash = await unstake(herodotusContract, sousId, amount, account)
        console.info(txHash)
      } else if (isOldSyrup) {
        const txHash = await sousEmegencyUnstake(sousChefContract, amount, account)
        console.info(txHash)
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, account)
        console.info(txHash)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [account, dispatch, isOldSyrup, herodotusContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export const useSousUnstakeVelo = (veloId: number) => {
  // const dispatch = useDispatch()
  const { account } = useWallet()

  const sousChefContract = useVeloPool(veloId)

  const handleUnstakeVelo = useCallback(
    async (amount: string) => {
      // if (sousId === 0) {
      const txHash = await unstakeVelo(sousChefContract, amount, account)
      console.info(txHash)
      // } else if (isOldSyrup) {
      //   const txHash = await sousEmegencyUnstake(sousChefContract, amount, account)
      //   console.info(txHash)
      // } else {
      //   const txHash = await sousUnstake(sousChefContract, amount, account)
      //   console.info(txHash)
      // }
      // dispatch(updateUserStakedBalance(sousId, account))
      // dispatch(updateUserBalance(sousId, account))
      // dispatch(updateUserPendingReward(sousId, account))
    },
    [account, sousChefContract],
  )

  return { onUnstake: handleUnstakeVelo }
}

export default useUnstake
