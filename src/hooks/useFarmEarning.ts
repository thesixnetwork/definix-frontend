import { useEffect, useState } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import multicall from 'utils/multicall'
import { getHerodotusAddress } from 'utils/addressHelpers'
import herodotusABI from 'config/abi/herodotus.json'
import { farmsConfig } from 'config/constants'
import useRefresh from './useRefresh'

const useFarmEarning = () => {
  const [balances, setBalance] = useState([])
  const { account }: { account: string } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllBalances = async () => {
      const calls = farmsConfig
        .filter((farm) => farm.pid > 0)
        .map((farm) => ({
          address: getHerodotusAddress(),
          name: 'pendingFinix',
          params: [farm.pid, account],
        }))

      const res = await multicall(herodotusABI, calls)

      setBalance(res)
    }

    if (account) {
      fetchAllBalances()
    }
  }, [account, fastRefresh])

  return balances
}

export default useFarmEarning
