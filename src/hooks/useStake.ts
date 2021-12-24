/* eslint no-lonely-if: 0 */

import { useCallback, useContext } from 'react'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { getAbiHerodotusByName } from 'hooks/hookHelper'
import { useHerodotus, useSousChef } from './useContract'
import * as klipProvider from './klipProvider'

const jsonConvert = (data: any) => JSON.stringify(data)
const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const { setShowModal } = useContext(KlipModalContext())

  const handleStake = useCallback(
    async (amount: string) => {
      let tx = null
      if (connector === 'klip') {
        // setShowModal(true)
        try {
          if (pid === 0) {
            klipProvider.genQRcodeContactInteract(
              herodotusContract._address,
              jsonConvert(getAbiHerodotusByName('enterStaking')),
              jsonConvert([new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
              setShowModal,
            )
          } else {
            klipProvider.genQRcodeContactInteract(
              herodotusContract._address,
              jsonConvert(getAbiHerodotusByName('deposit')),
              jsonConvert([pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
              setShowModal,
            )
          }
          tx = await klipProvider.checkResponse()
        } catch (error) {
          console.warn('useStake/handleStake] tx failed')
        } finally {
          setShowModal(false)
        }
      } else {
        tx = await stake(herodotusContract, pid, amount, account)
      }
      dispatch(fetchFarmUserDataAsync(account))
      console.info(tx)
      return tx
    },
    [account, dispatch, herodotusContract, pid, setShowModal, connector],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const sousChefContract = useSousChef(sousId)
  const { setShowModal } = useContext(KlipModalContext())

  const handleStake = useCallback(
    async (amount: string) => {
      let tx = null
      if (connector === 'klip') {
        // setShowModal(true)
        try {
          if (sousId === 0) {
            klipProvider.genQRcodeContactInteract(
              herodotusContract._address,
              jsonConvert(getAbiHerodotusByName('enterStaking')),
              jsonConvert([new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
              setShowModal,
            )
          } else {
            klipProvider.genQRcodeContactInteract(
              herodotusContract._address,
              jsonConvert(getAbiHerodotusByName('deposit')),
              jsonConvert([sousId, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
              setShowModal,
            )
          }
          tx = await klipProvider.checkResponse()
        } catch (error) {
          console.warn('useStake/handleStake] tx failed')
        } finally {
          setShowModal(false)
        }
        // dispatch(fetchFarmUserDataAsync(account))
      } else {
        if (sousId === 0) {
          tx = await stake(herodotusContract, 0, amount, account)
        } else if (sousId === 1) {
          tx = await stake(herodotusContract, 1, amount, account)
        } else if (isUsingBnb) {
          tx = await sousStakeBnb(sousChefContract, amount, account)
        } else {
          tx = await sousStake(sousChefContract, amount, account)
        }
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      return tx
    },
    [account, dispatch, isUsingBnb, herodotusContract, sousChefContract, sousId, setShowModal, connector],
  )

  return { onStake: handleStake }
}

export default useStake
