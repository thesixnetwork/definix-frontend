import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
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
import * as klipProvider from './klipProvider'

const jsonConvert = (data: any) => JSON.stringify(data)
const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const herodotusContract = useHerodotus()

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (connector === 'klip') {
        // setShowModal(true)
        if (pid === 0) {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('leaveStaking')),
            jsonConvert([new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
            setShowModal,
          )
        } else {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('withdraw')),
            jsonConvert([pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
            setShowModal,
          )
        }
        const tx = await klipProvider.checkResponse()

        setShowModal(false)
        dispatch(fetchFarmUserDataAsync(account))
        console.info(tx)
      } else {
        const txHash = await unstake(herodotusContract, pid, amount, account)
        dispatch(fetchFarmUserDataAsync(account))
        console.info(txHash)
      }
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
      if (sousId === 0) {
        const txHash = await unstake(herodotusContract, 0, amount, account)
        console.info(txHash)
      } else if (isOldSyrup) {
        const txHash = await sousEmegencyUnstake(sousChefContract, amount, account)
        console.info(txHash)
      } else if (sousId === 0) {
        const txHash = await unstake(herodotusContract, 0, amount, account)
        console.info(txHash)
      } else if (sousId === 1) {
        const txHash = await unstake(herodotusContract, 1, amount, account)
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

export default useUnstake
