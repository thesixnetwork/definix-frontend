import { Token, Config, Pair } from 'definixswap-sdk'
import sdkconfig from '../../sdkconfig'

Config.configure(sdkconfig)

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
export const WKLAY = {
  [intMainnetId]: process.env.REACT_APP_WKLAY_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_WKLAY_ADDRESS_TESTNET,
}
export const OUSDT = {
  [intMainnetId]: process.env.REACT_APP_OUSDT_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_OUSDT_ADDRESS_TESTNET,
}
export const KDAI = {
  [intMainnetId]: process.env.REACT_APP_KDAI_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_KDAI_ADDRESS_TESTNET,
}
export const OETH = {
  [intMainnetId]: process.env.REACT_APP_KETH_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_KETH_ADDRESS_TESTNET,
}
export const KWBTC = {
  [intMainnetId]: process.env.REACT_APP_KWBTC_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_KWBTC_ADDRESS_TESTNET,
}
export const OXRP = {
  [intMainnetId]: process.env.REACT_APP_OXRP_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_OXRP_ADDRESS_TESTNET,
}
export const KBNB = {
  [intMainnetId]: process.env.REACT_APP_KBNB_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_KBNB_ADDRESS_TESTNET,
}
export const KSP = {
  [intMainnetId]: process.env.REACT_APP_KSP_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_KSP_ADDRESS_TESTNET,
}
/**
 * @favor
 */
export const FAVOR = {
  [intMainnetId]: process.env.REACT_APP_FAVOR_ADDRESS_MAINNET,
  [intTestnetId]: process.env.REACT_APP_FAVOR_ADDRESS_TESTNET,
}

export const allTokens = {
  SIX,
  FINIX,
  WKLAY,
  OUSDT,
  KDAI,
  OETH,
  KWBTC,
  OXRP,
  KBNB,
  KSP,
  FAVOR,
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

export const getSingleLpNetwork = (token) => {
  return {
    [intMainnetId]: token[intMainnetId],
    [intTestnetId]: token[intTestnetId],
  }
}
