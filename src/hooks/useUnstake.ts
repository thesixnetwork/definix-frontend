import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
} from 'state/actions'
import BigNumber from 'bignumber.js'
import { getAbiHerodotusByName } from 'hooks/hookHelper'
import { unstake, sousUnstake, sousEmegencyUnstake } from 'utils/callHelpers'
import { useHerodotus, useSousChef } from './useContract'
import useWallet from './useWallet'
import useKlipContract from './useKlipContract'
import { useGasPrice } from 'state/application/hooks'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const gasPrice = useGasPrice()
  const herodotusContract = useHerodotus()
  const { isKlip, request } = useKlipContract()

  const handleUnstake = useCallback(
    async (amount: string) => {
      let tx = null
      if (isKlip()) {
        try {
          if (pid === 0) {
            tx = await request({
              contractAddress: herodotusContract._address,
              abi: getAbiHerodotusByName('leaveStaking'),
              input: [new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()],
            })
          } else {
            tx = await request({
              contractAddress: herodotusContract._address,
              abi: getAbiHerodotusByName('withdraw'),
              input: [pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()],
            })
          }
        } catch (error) {
          console.warn('useUnstake/handleUnstake] tx failed')
        }
      } else {
        tx = await unstake(herodotusContract, pid, amount, account, gasPrice)
      }
      dispatch(fetchFarmUserDataAsync(account))
      console.info(tx)
      return tx
    },
    [account, dispatch, herodotusContract, pid],
  )

  return { onUnstake: handleUnstake }
}

const SYRUPIDS = []

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const gasPrice = useGasPrice()
  const herodotusContract = useHerodotus()
  const sousChefContract = useSousChef(sousId)
  const isOldSyrup = SYRUPIDS.includes(sousId)
  const { isKlip, request } = useKlipContract()

  const handleUnstake = useCallback(
    async (amount: string) => {
      let tx = null
      if (isKlip()) {
        try {
          if (sousId === 0) {
            tx = await request({
              contractAddress: herodotusContract._address,
              abi: getAbiHerodotusByName('leaveStaking'),
              input: [new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()],
            })
          } else {
            tx = await request({
              contractAddress: herodotusContract._address,
              abi: getAbiHerodotusByName('withdraw'),
              input: [sousId, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()],
            })
          }
        } catch (error) {
          console.warn('useUnstake/handleUnStake] tx failed')
        }
        dispatch(fetchFarmUserDataAsync(account))
      } else {
        if (sousId === 0) {
          tx = await unstake(herodotusContract, 0, amount, account, gasPrice)
        } else if (sousId === 1) {
          tx = await unstake(herodotusContract, 1, amount, account, gasPrice)
        } else if (isOldSyrup) {
          tx = await sousEmegencyUnstake(sousChefContract, amount, account, gasPrice)
        } else {
          tx = await sousUnstake(sousChefContract, amount, account, gasPrice)
        }
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
      return tx
    },
    [account, dispatch, isOldSyrup, herodotusContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
