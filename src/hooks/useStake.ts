import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { useHerodotus, useSousChef, useVeloPool } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const herodotusContract = useHerodotus()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(herodotusContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
      return txHash
    },
    [account, dispatch, herodotusContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const herodotusContract = useHerodotus()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0 || sousId === 25) {
        await stake(herodotusContract, sousId, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, herodotusContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export const useStakeVelo = (veloId: number) => {
  // const dispatch = useDispatch()
  const { account } = useWallet()
  const veloContract = useVeloPool(veloId)
  // const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string) => {
      // if (sousId === 0) {
      //   await stake(veloContract, 0, amount, account)
      // } else{
      await sousStake(veloContract, amount, account)
      // }
      // dispatch(updateUserStakedBalance(sousId, account))
      // dispatch(updateUserBalance(sousId, account))
    },
    [account, veloContract],
  )

  return { onStake: handleStake }
}

export default useStake
