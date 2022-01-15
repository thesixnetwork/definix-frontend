import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import multicall from 'utils/multicall'
import { getHerodotusAddress, getPairAddress } from 'utils/addressHelpers'
import herodotusABI from 'config/abi/herodotus.json'
import { farmsConfig, veloConfig } from 'config/constants'
import { FarmConfig, PoolConfig } from 'config/constants/types'
import useRefresh from './useRefresh'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

export interface PoolVeloWithBalance extends PoolConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { account } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: getHerodotusAddress(),
        name: 'pendingFinix',
        params: [farm.pid, account],
      }))
      console.log('calls farm', calls)
      const rawResults = await multicall(herodotusABI, calls)
      const results = farmsConfig.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))

      setFarmsWithBalances(results)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])

  return farmsWithBalances
}

export default useFarmsWithBalance

export const usePoolVeloWithBalance = (veloId: number) => {
  const [poolVeloWithBalances, setPoolVeloWithBalances] = useState<PoolVeloWithBalance[]>([])
  console.log('poolVeloWithBalances', poolVeloWithBalances)
  const { account } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const calls = veloConfig.map((velo) => ({
        address: getHerodotusAddress(), // "0x32971Dd884E4010356cFfD26B819f553A1aD1a71"
        name: 'pendingFinix',
        params: [velo.sousId, account],
      }))

      console.log('calls', calls)

      const rawResults = await multicall(herodotusABI, calls)
      const results = veloConfig.map((velo, index) => ({ ...velo, balance: new BigNumber(rawResults[index]) }))
      setPoolVeloWithBalances(results)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh, veloId])

  return poolVeloWithBalances
}
