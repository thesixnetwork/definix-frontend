/* eslint no-lonely-if: 0 */
import { useCallback, useContext } from 'react'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { useDispatch } from 'react-redux'
import { getAbiHerodotusByName } from 'hooks/hookHelper'
import { fetchFarmUserDataAsync, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest } from 'utils/callHelpers'
import { useHerodotus, useSousChef } from './useContract'
import * as klipProvider from './klipProvider'

const jsonConvert = (data: any) => JSON.stringify(data)
export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()

  const { setShowModal } = useContext(KlipModalContext())

  const handleHarvest = useCallback(async () => {
    if (connector === 'klip') {
      // setShowModal(true)

      if (farmPid === 0) {
        klipProvider.genQRcodeContactInteract(
          herodotusContract._address,
          jsonConvert(getAbiHerodotusByName('leaveStaking')),
          jsonConvert(['0']),
          setShowModal,
        )
      } else {
        klipProvider.genQRcodeContactInteract(
          herodotusContract._address,
          jsonConvert(getAbiHerodotusByName('deposit')),
          jsonConvert([farmPid, '0']),
          setShowModal,
        )
      }
      const tx = await klipProvider.checkResponse()

      setShowModal(false)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(tx)
      return tx
    }

    const txHash = await harvest(herodotusContract, farmPid, account)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [account, dispatch, farmPid, herodotusContract, setShowModal, connector])

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

export const useSousHarvest = (sousId, isUsingKlay = false) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const sousChefContract = useSousChef(sousId)
  const herodotusContract = useHerodotus()
  const { setShowModal } = useContext(KlipModalContext())

  const handleHarvest = useCallback(async () => {
    if (connector === 'klip') {
      // setShowModal(true)

      if (sousId === 0) {
        klipProvider.genQRcodeContactInteract(
          herodotusContract._address,
          jsonConvert(getAbiHerodotusByName('leaveStaking')),
          jsonConvert(['0']),
          setShowModal,
        )
      } else {
        klipProvider.genQRcodeContactInteract(
          herodotusContract._address,
          jsonConvert(getAbiHerodotusByName('deposit')),
          jsonConvert([sousId, '0']),
          setShowModal,
        )
      }
      const tx = await klipProvider.checkResponse()

      setShowModal(false)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(tx)
    } else {
      if (sousId === 0) {
        await harvest(herodotusContract, 0, account)
      } else if (sousId === 1) {
        await harvest(herodotusContract, 1, account)
      } else if (isUsingKlay) {
        await soushHarvestBnb(sousChefContract, account)
      } else {
        await soushHarvest(sousChefContract, account)
      }
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingKlay, herodotusContract, sousChefContract, sousId, connector, setShowModal])

  return { onReward: handleHarvest }
}
