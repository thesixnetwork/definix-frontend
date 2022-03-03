import { useEffect, useMemo, useState } from 'react'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import Caver from 'caver-js'
import {
  getAddress,
  getHerodotusAddress,
  getFinixAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getBunnyFactoryAddress,
  getDefinixProfileAddress,
  getDefinixRabbitsAddress,
  getPointCenterIfoAddress,
  getBunnySpecialAddress,
  getTradingCompetRegisAddress,
} from 'utils/addressHelpers'
import { PoolCategory } from 'config/constants/types'
import ifo from 'config/abi/ifo.json'
import erc20 from 'config/abi/erc20.json'
import bunnyFactory from 'config/abi/bunnyFactory.json'
import definixRabbits from 'config/abi/definixRabbits.json'
import lottery from 'config/abi/lottery.json'
import lotteryTicket from 'config/abi/lotteryNft.json'
import herodotus from 'config/abi/herodotus.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import profile from 'config/abi/definixProfile.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import bunnySpecial from 'config/abi/bunnySpecial.json'
import tradeCompetRegisAbi from 'config/abi/definixTradeCompetitionABI.json'

import { Contract } from '@ethersproject/contracts'
import { WETH } from 'definixswap-sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { HERODOTUS_ADDRESS, poolsConfig } from 'config/constants'
import ENS_ABI from 'config/constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from 'config/constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from 'config/constants/abis/erc20'
import ERC20_ABI from 'config/constants/abis/erc20.json'
import WETH_ABI from 'config/constants/abis/weth.json'
import HERODOTUS_ABI from 'config/constants/abis/herodotus.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from 'config/constants/multicall'
import { getContract } from 'utils'
import useWallet from './useWallet'
import { getCaver } from 'utils/caver'

const intMainnetId = parseInt(process.env.REACT_APP_MAINNET_ID || '')
const intTestnetId = parseInt(process.env.REACT_APP_TESTNET_ID || '')

const useContract = (abi: AbiItem, address: string, contractOptions?: ContractOptions) => {
  const caver = getCaver()
  const [contract, setcontract] = useState(new caver.klay.Contract(abi, address, contractOptions))

  useEffect(() => {
    // const fetchData = async () => {
    //   const rpc = await getRPCHalper()
    //   const caverEffect = new Caver(rpc)
    //   setcontract(new caverEffect.klay.Contract(abi, address, contractOptions))
    // }
    // fetchData()

    // const caverEffect = new Caver(process.env.REACT_APP_NODE_3)
    // @ts-ignore
    setcontract(new caver.klay.Contract(abi, address, contractOptions))
  }, [abi, address, contractOptions])

  return contract
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const ifoAbi = ifo as unknown as AbiItem
  return useContract(ifoAbi, address)
}

export const useERC20 = (address: string) => {
  const erc20Abi = erc20 as unknown as AbiItem
  return useContract(erc20Abi, address)
}

export const useFinix = () => {
  return useERC20(getFinixAddress())
}

export const useBunnyFactory = () => {
  const bunnyFactoryAbi = bunnyFactory as unknown as AbiItem
  return useContract(bunnyFactoryAbi, getBunnyFactoryAddress())
}

export const useDefinixRabbits = () => {
  const definixRabbitsAbi = definixRabbits as unknown as AbiItem
  return useContract(definixRabbitsAbi, getDefinixRabbitsAddress())
}

export const useProfile = () => {
  const profileABIAbi = profile as unknown as AbiItem
  return useContract(profileABIAbi, getDefinixProfileAddress())
}

export const useLottery = () => {
  const abi = lottery as unknown as AbiItem
  return useContract(abi, getLotteryAddress())
}

export const useLotteryTicket = () => {
  const abi = lotteryTicket as unknown as AbiItem
  return useContract(abi, getLotteryTicketAddress())
}

export const useHerodotus = () => {
  const abi = herodotus as unknown as AbiItem
  return useContract(abi, getHerodotusAddress())
}

export const useTradingCompetRegisContract = () => {
  const abi = tradeCompetRegisAbi as unknown as AbiItem
  return useContract(abi, getTradingCompetRegisAddress())
}

export const useSousChef = (id) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const rawAbi = config.poolCategory === PoolCategory.KLAYTN ? sousChefBnb : sousChef
  const abi = rawAbi as unknown as AbiItem
  return useContract(abi, getAddress(config.contractAddress))
}

export const usePointCenterIfoContract = () => {
  const abi = pointCenterIfo as unknown as AbiItem
  return useContract(abi, getPointCenterIfoAddress())
}

export const useBunnySpecialContract = () => {
  const abi = bunnySpecial as unknown as AbiItem
  return useContract(abi, getBunnySpecialAddress())
}

export default useContract

// returns null on errors
function useContractForExchange(
  address: string | 0 | undefined,
  ABI: any,
  withSignerIfPossible = true,
): Contract | null {
  const { account, library } = useWallet()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContractForExchange(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useWallet()
  // const { chainId } = useActiveWeb3React()
  return useContractForExchange(chainId ? WETH(chainId).address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useWallet()
  // const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case intMainnetId:
      case intTestnetId:
    }
  }
  return useContractForExchange(address, ENS_ABI, withSignerIfPossible)
}

export function useHerodotusContract(): Contract | null {
  const { chainId } = useWallet()
  // const { chainId } = useActiveWeb3React()
  return useContractForExchange(chainId && HERODOTUS_ADDRESS[chainId], HERODOTUS_ABI)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContractForExchange(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContractForExchange(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContractForExchange(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useWallet()
  // const { chainId } = useActiveWeb3React()
  return useContractForExchange(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}
