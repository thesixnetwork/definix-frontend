import { useEffect, useState } from 'react'
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
import { poolsConfig } from 'config/constants'
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
// import caver from '../klaytn/caver'

const useContract = (abi: AbiItem, address: string, contractOptions?: ContractOptions) => {
  // @ts-ignore
  const caver = window.caver || new Caver(process.env.REACT_APP_NODE_3)
  const [contract, setcontract] = useState(new caver.klay.Contract(abi, address, contractOptions))

  useEffect(() => {
    setcontract(new caver.klay.Contract(abi, address, contractOptions))
  }, [abi, address, contractOptions, caver.klay.Contract])

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
