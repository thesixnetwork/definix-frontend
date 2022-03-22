/* eslint no-lonely-if: 0 */

import { useCallback, useContext } from 'react'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { getAbiHerodotusByName } from 'hooks/hookHelper'
import { useHerodotus, useSousChef } from './useContract'
import * as klipProvider from './klipProvider'
import useWallet from './useWallet'
import { isKlipConnector } from './useApprove'
import useKlipContract from './useKlipContract'

const jsonConvert = (data: any) => JSON.stringify(data)
const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const herodotusContract = useHerodotus()
  const { isKlip, request } = useKlipContract()

  const handleStake = useCallback(
    async (amount: string) => {
      let tx = null
      if (isKlip()) {
        try {
          if (pid === 0) {
            tx = await request({
              contractAddress: herodotusContract._address,
              abi: jsonConvert(getAbiHerodotusByName('enterStaking')),
              input: jsonConvert([new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
            })
          } else {
            tx = await request({
              contractAddress: herodotusContract._address,
              abi: jsonConvert(getAbiHerodotusByName('deposit')),
              input: jsonConvert([pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
            })
          }
        } catch (error) {
          console.warn('useStake/handleStake] tx failed')
        }
      } else {
        tx = await stake(herodotusContract, pid, amount, account)
      }
      dispatch(fetchFarmUserDataAsync(account))
      console.info(tx)
      return tx
    },
    [account, dispatch, herodotusContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const sousChefContract = useSousChef(sousId)
  const { isKlip, request } = useKlipContract()

  const handleStake = useCallback(
    async (amount: string) => {
      let tx = null
      if (isKlip()) {
        try {
          if (sousId === 0) {
            tx = await request({
              contractAddress: herodotusContract._address,
              abi: jsonConvert(getAbiHerodotusByName('enterStaking')),
              input: jsonConvert([new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
            })
          } else {
            tx = await request({
              contractAddress: herodotusContract._address,
              abi: jsonConvert(getAbiHerodotusByName('deposit')),
              input: jsonConvert([sousId, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]),
            })
          }
        } catch (error) {
          console.warn('useStake/handleStake] tx failed')
        }
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
    [account, dispatch, isUsingBnb, herodotusContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake
