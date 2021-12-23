/* eslint no-lonely-if: 0 */
import { useCallback, useContext } from 'react'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
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
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const { setShowModal } = useContext(KlipModalContext())

  const handleUnstake = useCallback(
    async (amount: string) => {
      let tx = null
      if (connector === 'klip') {
        // setShowModal(true)
        try {
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
          tx = await klipProvider.checkResponse()
        } catch (error) {
          console.warn('useUnstake/handleUnstake] tx failed')
        } finally {
          setShowModal(false)
        }
      } else {
        tx = await unstake(herodotusContract, pid, amount, account)
      }
      dispatch(fetchFarmUserDataAsync(account))
      console.info(tx)
      return tx
    },
    [account, dispatch, herodotusContract, pid, setShowModal, connector],
  )

  return { onUnstake: handleUnstake }
}

const SYRUPIDS = []

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const sousChefContract = useSousChef(sousId)
  const isOldSyrup = SYRUPIDS.includes(sousId)
  const { setShowModal } = useContext(KlipModalContext())

  const handleUnstake = useCallback(
    async (amount: string) => {
      let tx = null
      if (connector === 'klip') {
        // setShowModal(true)
        try {
          if (sousId === 0) {
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
              jsonConvert([sousId, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
              setShowModal,
            )
          }
          tx = await klipProvider.checkResponse()          
        } catch (error) {
          console.warn('useUnstake/handleUnStake] tx failed')
        } finally {
          setShowModal(false)
        }
        dispatch(fetchFarmUserDataAsync(account))
      } else {
        if (sousId === 0) {
          tx = await unstake(herodotusContract, 0, amount, account)
        } else if (sousId === 1) {
          tx = await unstake(herodotusContract, 1, amount, account)
        } else if (isOldSyrup) {
          tx = await sousEmegencyUnstake(sousChefContract, amount, account)
        } else {
          tx = await sousUnstake(sousChefContract, amount, account)
        }
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
      return tx
    },
    [account, dispatch, isOldSyrup, herodotusContract, sousChefContract, sousId, setShowModal, connector],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
