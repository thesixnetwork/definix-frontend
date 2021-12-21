/* eslint no-lonely-if: 0 */
import { useCallback, useContext, useState } from 'react'
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

export const useAllHarvest = (farms: { pid: number, lpSymbol: string}[]) => {
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const dispatch = useDispatch()
  const { setShowModal } = useContext(KlipModalContext())
  const [currentHarvestStackIndex, setCurrentHarvestStackIndex] = useState(0)
  const [harvestResultList, setHarvestResultList] = useState([])

  const harvestUsingKlipWallet = useCallback(
    async (farmPid: number) => {
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
      return klipProvider.checkResponse()
    },
    [setShowModal, herodotusContract._address],
  )

  const harvestAllUsingKlipWallet = useCallback(
    async (txs, txIndex) => {
      if (txs.length === 0) return Promise.resolve()
      setCurrentHarvestStackIndex(txIndex)
      let isSuccess = false

      try {
        const tx = await harvestUsingKlipWallet(txs[txIndex].pid)
        isSuccess = true
        console.info(tx)
      } catch {
        console.log('tx failed')
      } finally {
        setHarvestResultList((prev) => [{
          symbol: txs[txIndex].lpSymbol,
          isSuccess
        }, ...prev])
        setShowModal(false)
      }

      if (txIndex < txs.length - 1) {
        return harvestAllUsingKlipWallet(txs, txIndex + 1)
      }
      return Promise.resolve()
    },
    [harvestUsingKlipWallet, setShowModal],
  )

  const handleHarvest = useCallback(async () => {
    setHarvestResultList([])

    if (connector === 'klip') {
      await harvestAllUsingKlipWallet(farms, 0)
      setCurrentHarvestStackIndex(0)
      setHarvestResultList([])
      dispatch(fetchFarmUserDataAsync(account))
      return Promise.resolve()
    }

    const harvestPromises = farms.reduce((accum, farm) => {
      return [...accum, harvest(herodotusContract, farm.pid, account)]
    }, [])
    return Promise.all(harvestPromises)
  }, [account, farms, herodotusContract, connector, harvestAllUsingKlipWallet, dispatch])

  return { onReward: handleHarvest, currentHarvestStackIndex, harvestResultList }
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
