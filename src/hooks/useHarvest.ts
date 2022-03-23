/* eslint no-lonely-if: 0 */
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getAbiHerodotusByName } from 'hooks/hookHelper'
import { fetchFarmUserDataAsync, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest } from 'utils/callHelpers'
import { useHerodotus, useSousChef } from './useContract'
import useWallet from './useWallet'
import useKlipContract from './useKlipContract'

const jsonConvert = (data: any) => JSON.stringify(data)
export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const { isKlip, request } = useKlipContract()

  const handleHarvest = useCallback(async () => {
    let tx = null
    if (isKlip()) {
      if (farmPid === 0) {
        tx = await request({
          contractAddress: herodotusContract._address,
          abi: jsonConvert(getAbiHerodotusByName('leaveStaking')),
          input: jsonConvert(['0']),
        })
      } else {
        tx = await request({
          contractAddress: herodotusContract._address,
          abi: jsonConvert(getAbiHerodotusByName('deposit')),
          input: jsonConvert([farmPid, '0']),
        })
      }
    } else {
      tx = await harvest(herodotusContract, farmPid, account)
    }
    dispatch(fetchFarmUserDataAsync(account))
    return tx
  }, [account, dispatch, farmPid, herodotusContract, connector])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farms: { pid: number; lpSymbol: string }[]) => {
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const dispatch = useDispatch()
  const { isKlip, request } = useKlipContract()
  const [harvestResultList, setHarvestResultList] = useState([])

  const harvestUsingKlip = useCallback(
    async (farmPid: number) => {
      if (farmPid === 0) {
        return await request({
          contractAddress: herodotusContract._address,
          abi: jsonConvert(getAbiHerodotusByName('leaveStaking')),
          input: jsonConvert(['0']),
        })
      } else {
        return await request({
          contractAddress: herodotusContract._address,
          abi: jsonConvert(getAbiHerodotusByName('deposit')),
          input: jsonConvert([farmPid, '0']),
        })
      }
    },
    [herodotusContract._address],
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
      }

      if (txIndex < txs.length - 1) {
        return harvestAllUsingKlip(txs, txIndex + 1)
      }
      return Promise.resolve()
    },
    [harvestUsingKlip],
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

    if (isKlip()) {
      await harvestAllUsingKlip(farms, 0)
    } else {
      await farms.map(async (farm) => {
        await harvest(herodotusContract, farm.pid, account)
          .then(() =>
            setHarvestResultList([
              {
                symbol: farm.lpSymbol,
                isSuccess: true,
              },
              ...harvestResultList,
            ]),
          )
          .catch(() =>
            setHarvestResultList([
              {
                symbol: farm.lpSymbol,
                isSuccess: false,
              },
              ...harvestResultList,
            ]),
          )
      })
    }
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
  const { isKlip, request } = useKlipContract()

  const handleHarvest = useCallback(async () => {
    if (isKlip()) {
      let tx
      if (sousId === 0) {
        tx = await request({
          contractAddress: herodotusContract._address,
          abi: jsonConvert(getAbiHerodotusByName('leaveStaking')),
          input: jsonConvert(['0']),
        })
      } else {
        tx = await request({
          contractAddress: herodotusContract._address,
          abi: jsonConvert(getAbiHerodotusByName('deposit')),
          input: jsonConvert([sousId, '0']),
        })
      }

      dispatch(fetchFarmUserDataAsync(account))
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
  }, [account, dispatch, isUsingKlay, herodotusContract, sousChefContract, sousId, connector])

  return { onReward: handleHarvest }
}
