import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
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

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const sousChefContract = useSousChef(sousId)
  const herodotusContract = useHerodotus()
  const { setShowModal } = useContext(KlipModalContext())

  const handleHarvest = useCallback(async () => {
    if (sousId === 0) {
      await harvest(herodotusContract, 0, account)
    } else if (isUsingBnb) {
      await soushHarvestBnb(sousChefContract, account)
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
  }, [account, dispatch, isUsingBnb, herodotusContract, sousChefContract, sousId])

  return { onReward: handleHarvest }
}
