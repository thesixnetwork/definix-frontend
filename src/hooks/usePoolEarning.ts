import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import multicall from 'utils/multicall'
import { getHerodotusAddress } from 'utils/addressHelpers'
import herodotusABI from 'config/abi/herodotus.json'
import { farmsConfig } from 'config/constants'
import { usePrivateData } from 'hooks/useLongTermStake'
import useRefresh from './useRefresh'

const usePoolEarning = () => {
  const [balances, setBalance] = useState([])
  const { account }: { account: string } = useWallet()
  const { fastRefresh } = useRefresh()
  const { finixEarn } = usePrivateData()

  useEffect(() => {
    const fetchAllBalances = async () => {
      const calls = farmsConfig
        .filter((farm) => farm.tokenSymbol === farm.quoteTokenSymbol && (farm.pid === 0 || farm.pid === 1))
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

  return [...balances, new BigNumber(finixEarn).times(new BigNumber(10).pow(18))]
}

export default usePoolEarning
