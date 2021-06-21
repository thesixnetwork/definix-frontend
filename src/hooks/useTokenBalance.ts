import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'klaytn-use-wallet'
import { provider } from 'web3-core'
import finixABI from 'config/abi/finix.json'
import { getContract, getWeb3Contract } from 'utils/caver'
import { getTokenBalance } from 'utils/erc20'
import { getFinixAddress, getBscFinixAddress, getBscCollecteralAddress } from 'utils/addressHelpers'
import useCaver from './useCaver'
import useRefresh from './useRefresh'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(klaytn, tokenAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && klaytn) {
      fetchBalance()
    }
  }, [account, klaytn, tokenAddress, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const finixBurned = useBurnedBalance(getFinixAddress())
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const finixContract = getContract(finixABI, getFinixAddress())
      const supply = await finixContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply).minus(finixBurned))
    }

    fetchTotalSupply()
  }, [slowRefresh, finixBurned])

  return totalSupply
}

export const useTotalTransfer = () => {
  const { slowRefresh } = useRefresh()
  const [totalTransfer, setTotalTransfer] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalTransfer() {

      const finixContract = getWeb3Contract(finixABI, getBscFinixAddress())
      const supply = await finixContract.methods.balanceOf(getBscCollecteralAddress()).call()
      setTotalTransfer(new BigNumber(supply))
    }

    fetchTotalTransfer()
  }, [slowRefresh])

  return totalTransfer
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const caver = useCaver()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(
        caver.currentProvider,
        tokenAddress,
        '0x000000000000000000000000000000000000dEaD',
      )
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [caver, tokenAddress, slowRefresh])

  return balance
}

export default useTokenBalance
