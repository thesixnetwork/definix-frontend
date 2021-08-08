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
      if (connector === 'klip') {
        setShowModal(true)
        if (pid === 0) {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('enterStaking')),
            jsonConvert([new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
          )
        } else {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('deposit')),
            jsonConvert([pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
          )
        }
        const tx = await klipProvider.checkResponse()

        setShowModal(false)
        dispatch(fetchFarmUserDataAsync(account))
        console.info(tx)
      } else {
        const txHash = await stake(herodotusContract, pid, amount, account)
        dispatch(fetchFarmUserDataAsync(account))
        console.info(txHash)
      }
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
      if (connector === 'klip') {
        setShowModal(true)
        if (sousId === 0) {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('enterStaking')),
            jsonConvert([new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
          )
        } else {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('deposit')),
            jsonConvert([sousId, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
          )
        }
        await klipProvider.checkResponse()
        setShowModal(false)
        // dispatch(fetchFarmUserDataAsync(account))
      } else {
        if (sousId === 0) {
          await stake(herodotusContract, 0, amount, account)
        } else if (sousId === 1) {
          await stake(herodotusContract, 1, amount, account)
        } else if (isUsingBnb) {
          await sousStakeBnb(sousChefContract, amount, account)
        } else {
          await sousStake(sousChefContract, amount, account)
        }
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, herodotusContract, sousChefContract, sousId, setShowModal, connector],
  )

  return { onStake: handleStake }
}

export default useStake
