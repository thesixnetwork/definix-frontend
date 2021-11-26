import { Token, Config, Pair } from 'definixswap-sdk'
import { getCreate2Address } from '@ethersproject/address'
import { pack, keccak256 } from '@ethersproject/solidity'
import sdkconfig from '../../sdkconfig'

Config.configure(sdkconfig)

const configChainId = process.env.REACT_APP_CHAIN_ID || ''
const mainnetId = process.env.REACT_APP_MAINNET_ID || ''
const isMainnet = configChainId === mainnetId

const defaultFactoryAddress = isMainnet
  ? process.env.REACT_APP_MAINNET_FACTORY_ADDRESS
  : process.env.REACT_APP_TESTNET_FACTORY_ADDRESS
const defaultInitCodeHash = isMainnet
  ? process.env.REACT_APP_MAINNET_INIT_CODE_HASH
  : process.env.REACT_APP_TESTNET_INIT_CODE_HASH

export const getPairAddress = (tokenA: string, tokenB: string, factoryAddress?: string, initCodeHash?: string) => {
  const currentFactoryAddress = factoryAddress || defaultFactoryAddress
  const currentInitCodeHash = initCodeHash || defaultInitCodeHash
  const tokens = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA]
  return getCreate2Address(
    currentFactoryAddress,
    keccak256(['bytes'], [pack(['address', 'address'], [tokens[0], tokens[1]])]),
    currentInitCodeHash,
  )
}

const intMainnetId = parseInt(process.env.REACT_APP_MAINNET_ID || '')
const intTestnetId = parseInt(process.env.REACT_APP_TESTNET_ID || '')

export const getAddress = (token) => {
  return process.env.REACT_APP_CHAIN_ID === process.env.REACT_APP_MAINNET_ID ? token[intMainnetId] : token[intTestnetId]
}

export const SIX = {
  [intMainnetId]: process.env.REACT_APP_SIX_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
}
export const FINIX = {
  [intMainnetId]: process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_FINIX_ADDRESS_TESTNET,
}
export const WBNB = {
  [intMainnetId]: process.env.REACT_APP_WBNB_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_WBNB_ADDRESS_TESTNET,
}
export const BNB = WBNB
export const BUSD = {
  [intMainnetId]: process.env.REACT_APP_BUSD_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_BUSD_ADDRESS_TESTNET,
}
export const USDT = {
  [intMainnetId]: process.env.REACT_APP_USDT_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_USDT_ADDRESS_TESTNET,
}
export const BTCB = {
  [intMainnetId]: process.env.REACT_APP_BTCB_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_BTCB_ADDRESS_TESTNET,
}
export const ETH = {
  [intMainnetId]: process.env.REACT_APP_ETH_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_ETH_ADDRESS_TESTNET,
}
export const XRP = {
  [intMainnetId]: process.env.REACT_APP_XRP_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_XRP_ADDRESS_TESTNET,
}
export const ADA = {
  [intMainnetId]: process.env.REACT_APP_ADA_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_ADA_ADDRESS_TESTNET,
}
export const MBOX = {
  [intMainnetId]: process.env.REACT_APP_MBOX_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_MBOX_ADDRESS_TESTNET,
}
export const TLM = {
  [intMainnetId]: process.env.REACT_APP_TLM_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_TLM_ADDRESS_TESTNET,
}
export const SUSHI = {
  [intMainnetId]: process.env.REACT_APP_SUSHI_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_SUSHI_ADDRESS_TESTNET,
}
export const UNI = {
  [intMainnetId]: process.env.REACT_APP_UNI_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_UNI_ADDRESS_TESTNET,
}
export const ALPHA = {
  [intMainnetId]: process.env.REACT_APP_ALPHA_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_ALPHA_ADDRESS_TESTNET,
}
export const DODO = {
  [intMainnetId]: process.env.REACT_APP_DODO_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_DODO_ADDRESS_TESTNET,
}
export const XVS = {
  [intMainnetId]: process.env.REACT_APP_XVS_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_XVS_ADDRESS_TESTNET,
}
export const DOT = {
  [intMainnetId]: process.env.REACT_APP_DOT_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_DOT_ADDRESS_TESTNET,
}
export const DOGE = {
  [intMainnetId]: process.env.REACT_APP_DOGE_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_DOGE_ADDRESS_TESTNET,
}
export const LTC = {
  [intMainnetId]: process.env.REACT_APP_LTC_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_LTC_ADDRESS_TESTNET,
}
export const AVAX = {
  [intMainnetId]: process.env.REACT_APP_AVAX_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_AVAX_ADDRESS_TESTNET,
}
export const CAKE = {
  [intMainnetId]: process.env.REACT_APP_CAKE_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_CAKE_ADDRESS_TESTNET,
}
export const THG = {
  [intMainnetId]: process.env.REACT_APP_THG_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_THG_ADDRESS_TESTNET,
}
export const ALICE = {
  [intMainnetId]: process.env.REACT_APP_ALICE_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_ALICE_ADDRESS_TESTNET,
}
export const AXS = {
  [intMainnetId]: process.env.REACT_APP_AXS_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_AXS_ADDRESS_TESTNET,
}
export const VELO = {
  [intMainnetId]: process.env.REACT_APP_VELO_TOKEN_MAINNET,
  [intTestnetId]: process.env.REACT_APP_VELO_TOKEN_TESTNET,
}

export const allTokens = {
  SIX,
  FINIX,
  WBNB,
  BNB,
  USDT,
  BUSD,
  BTCB,
  ETH,
  XRP,
  ADA,
  MBOX,
  TLM,
  SUSHI,
  UNI,
  ALPHA,
  DODO,
  XVS,
  DOT,
  DOGE,
  LTC,
  AXS,
  VELO,
}

export const getLpAddress = (firstAddress: string, secondAddress: string, chainId: number) => {
  return Pair.getAddress(
    new Token(chainId, firstAddress, 18, 'DUMMY', 'DUMMY'),
    new Token(chainId, secondAddress, 18, 'DUMMY', 'DUMMY'),
  )
}

export const getLpNetwork = (firstToken, secondToken) => {
  return {
    [intMainnetId]: getLpAddress(firstToken[intMainnetId], secondToken[intMainnetId], intMainnetId),
    [intTestnetId]: getLpAddress(firstToken[intTestnetId], secondToken[intTestnetId], intTestnetId),
  }
}

export const getCustomLpNetwork = (firstToken, secondToken, factoryAddress, initCodeHash) => {
  return {
    [intMainnetId]: getPairAddress(
      firstToken[intMainnetId],
      secondToken[intMainnetId],
      factoryAddress[intMainnetId],
      initCodeHash[intMainnetId],
    ),
    [intTestnetId]: getPairAddress(
      firstToken[intTestnetId],
      secondToken[intTestnetId],
      factoryAddress[intTestnetId],
      initCodeHash[intTestnetId],
    ),
  }
}

export const getSingleLpNetwork = (token) => {
  return {
    [intMainnetId]: token[intMainnetId],
    [intTestnetId]: token[intTestnetId],
  }
}
