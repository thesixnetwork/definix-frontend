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
