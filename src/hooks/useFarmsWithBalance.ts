import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import multicall from 'utils/multicall'
import { getHerodotusAddress } from 'utils/addressHelpers'
import herodotusABI from 'config/abi/herodotus.json'
import { farmsConfig } from 'config/constants'
import { FarmConfig } from 'config/constants/types'
import useRefresh from './useRefresh'

export interface FarmWithBalance extends FarmConfig {
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
