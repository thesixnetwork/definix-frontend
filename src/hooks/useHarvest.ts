/* eslint no-lonely-if: 0 */
import { useCallback, useContext, useState } from 'react'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { useDispatch } from 'react-redux'
import { getAbiHerodotusByName } from 'hooks/hookHelper'
import { fetchFarmUserDataAsync, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest } from 'utils/callHelpers'
import { useHerodotus, useSousChef } from './useContract'
import * as klipProvider from './klipProvider'
import useWallet from './useWallet'

const jsonConvert = (data: any) => JSON.stringify(data)
export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()

  const { setShowModal } = useContext(KlipModalContext())

  const handleHarvest = useCallback(async () => {
    let tx = null
    if (connector === 'klip') {
      // setShowModal(true)
      try {
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
        tx = await klipProvider.checkResponse()
      } catch (error) {
        console.warn('useHarvest/handleHarvest] tx failed')
      } finally {
        setShowModal(false)
      }
    } else {
      tx = await harvest(herodotusContract, farmPid, account)
    }
    dispatch(fetchFarmUserDataAsync(account))
    return tx
  }, [account, dispatch, farmPid, herodotusContract, setShowModal, connector])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farms: { pid: number; lpSymbol: string }[]) => {
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const dispatch = useDispatch()
  const { setShowModal } = useContext(KlipModalContext())
  const [harvestResultList, setHarvestResultList] = useState([])

  const harvestUsingKlip = useCallback(
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

  const harvestAllUsingKlip = useCallback(
    async (txs, txIndex) => {
      if (txs.length === 0) return Promise.resolve()
      let isSuccess = false

      try {
        const tx = await harvestUsingKlip(txs[txIndex].pid)
        isSuccess = true
        console.info(tx)
      } catch {
        // tx failed
        console.warn('useHarvest/harvestAllUsingKlip] tx failed')
      } finally {
        setHarvestResultList((prev) => [
          {
            symbol: txs[txIndex].lpSymbol,
            isSuccess,
          },
          ...prev,
        ])
        setShowModal(false)
      }

      if (txIndex < txs.length - 1) {
        return harvestAllUsingKlip(txs, txIndex + 1)
      }
      return Promise.resolve()
    },
    [harvestUsingKlip, setShowModal],
  )

  // const harvestUsingOthers = useCallback((farm) => {
  //   let isSuccess = false
  //   try {
  //     const tx = await harvest(herodotusContract, farm.pid, account)
  //     if (tx !== null) {
  //       console.log('tx success', tx)
  //       isSuccess = true
  //     } else {
  //       console.log('tx failed', tx)
  //     }
  //   } catch (error) {
  //     console.log('tx failed', error)
  //   } finally {
  //     console.log('tx done', farm.pid, farm.lpSymbol, isSuccess)
  //     setHarvestResultList((prev) => [
  //       {
  //         symbol: farm.lpSymbol,
  //         isSuccess,
  //       },
  //       ...prev,
  //     ])
  //   }
  // }, [herodotusContract, account])

  const handleHarvest = useCallback(async () => {
    setHarvestResultList([])

    if (connector === 'klip') {
      await harvestAllUsingKlip(farms, 0)
    } else {
      await Promise.all(farms.map((farm) => harvest(herodotusContract, farm.pid, account)))
    }
    setHarvestResultList([])
    dispatch(fetchFarmUserDataAsync(account))
    return Promise.resolve()
  }, [account, farms, connector, harvestAllUsingKlip, dispatch, herodotusContract])

  return {
    onReward: handleHarvest,
    harvestResultList,
  }
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
      return tx
    }

    let tx = null
    if (sousId === 0) {
      tx = await harvest(herodotusContract, 0, account)
    } else if (sousId === 1) {
      tx = await harvest(herodotusContract, 1, account)
    } else if (isUsingKlay) {
      tx = await soushHarvestBnb(sousChefContract, account)
    } else {
      tx = await soushHarvest(sousChefContract, account)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
    return tx
  }, [account, dispatch, isUsingKlay, herodotusContract, sousChefContract, sousId, connector, setShowModal])

  return { onReward: handleHarvest }
}
