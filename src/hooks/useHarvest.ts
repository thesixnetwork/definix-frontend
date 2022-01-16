import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  updateUserBalance,
  updateUserPendingReward,
  fetchRebalanceRewards,
} from 'state/actions'
import { useRebalances } from 'state/hooks'
import { soushHarvest, soushHarvestBnb, harvest, rebalanceHarvest } from 'utils/callHelpers'
import { useHerodotus, useSousChef, useVeloPool, useApolloV2 } from './useContract'

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const herodotusContract = useHerodotus()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(herodotusContract, farmPid, account)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [account, dispatch, farmPid, herodotusContract])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWallet()
  const herodotusContract = useHerodotus()

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(herodotusContract, pid, account)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farmPids, herodotusContract])

  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const sousChefContract = useSousChef(sousId)
  const herodotusContract = useHerodotus()

  const handleHarvest = useCallback(async () => {
    if (sousId === 0 || sousId === 25) {
      await harvest(herodotusContract, sousId, account)
    } else if (isUsingBnb) {
      await soushHarvestBnb(sousChefContract, account)
    } else {
      await soushHarvest(sousChefContract, account)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingBnb, herodotusContract, sousChefContract, sousId])

  return { onReward: handleHarvest }
}

export const useRebalanceHarvest = (apolloAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const rebalances = useRebalances()
  const apolloV2Contract = useApolloV2(apolloAddress)

  const handleHarvest = useCallback(async () => {
    const txHash = await rebalanceHarvest(apolloV2Contract, account)
    dispatch(fetchRebalanceRewards(account, rebalances))

    return txHash
  }, [account, dispatch, rebalances, apolloV2Contract])
  return { onReward: handleHarvest }
}

export const useVeloHarvest = (veloId: number) => {
  // const dispatch = useDispatch()
  const { account } = useWallet()
  const sousChefContract = useVeloPool(veloId)
  // const herodotusContract = useHerodotus()

  const handleHarvest = useCallback(async () => {
    // if (sousId === 0) {
    //   await harvest(herodotusContract, 0, account)
    // } else if (isUsingBnb) {
    //   await soushHarvestBnb(sousChefContract, account)
    // } else {
    await soushHarvest(sousChefContract, account)
    // }
    // dispatch(updateUserPendingReward(sousId, account))
    // dispatch(updateUserBalance(sousId, account))
  }, [account, sousChefContract])

  return { onRewardVelo: handleHarvest }
}
