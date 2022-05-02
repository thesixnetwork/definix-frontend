import { Config, JSBI, Pair, Percent, Token, WETH } from 'definixswap-sdk'
import farmsConfig from './farms'
import sdkconfig from '../../sdkconfig'

const communityFarms = farmsConfig.filter((farm) => farm.isCommunity).map((farm) => farm.tokenSymbol)

export const managementFee = 0.2
export const buyBackFee = 0.3
export const ecosystemFee = 0.3
export { farmsConfig, communityFarms }
export { default as poolsConfig } from './pools'

Config.configure(sdkconfig)

const intMainnetId = parseInt(process.env.REACT_APP_MAINNET_ID || '')
const intTestnetId = parseInt(process.env.REACT_APP_TESTNET_ID || '')

export const ChainId = {
  MAINNET: intMainnetId,
  TESTNET: intTestnetId,
}

export const ROUTER_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_ROUTER_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_ROUTER_ADDRESS_TESTNET || '',
}

export const DEPARAM_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_DEPARAM_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_DEPARAM_ADDRESS_TESTNET || '',
}

export const MULTICALL_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_MULTICALL_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_MULTICALL_ADDRESS_TESTNET || '',
}

export const SIX_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_SIX_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_SIX_ADDRESS_TESTNET || '',
}

export const FINIX_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_FINIX_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_FINIX_ADDRESS_TESTNET || '',
}

export const KSP_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_KSP_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_KSP_ADDRESS_TESTNET || '',
}

export const KDAI_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_KDAI_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_KDAI_ADDRESS_TESTNET || '',
}

export const OUSDT_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_OUSDT_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_OUSDT_ADDRESS_TESTNET || '',
}

export const WKLAY_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_WKLAY_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_WKLAY_ADDRESS_TESTNET || '',
}

export const OETH_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_OETH_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_OETH_ADDRESS_TESTNET || '',
}

export const KWBTC_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_KWBTC_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_KWBTC_ADDRESS_TESTNET || '',
}

export const OXRP_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_OXRP_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_OXRP_ADDRESS_TESTNET || '',
}

export const KBNB_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_KBNB_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_KBNB_ADDRESS_TESTNET || '',
}

export const FAVOR_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_FAVOR_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_FAVOR_ADDRESS_TESTNET || '',
}

export const allTokenAddresses = {
  SIX: SIX_ADDRESS,
  FINIX: FINIX_ADDRESS,
  WKLAY: WKLAY_ADDRESS,
  OUSDT: OUSDT_ADDRESS,
  KDAI: KDAI_ADDRESS,
  OETH: OETH_ADDRESS,
  KWBTC: KWBTC_ADDRESS,
  OXRP: OXRP_ADDRESS,
  KBNB: KBNB_ADDRESS,
  KSP: KSP_ADDRESS,
  FAVOR: FAVOR_ADDRESS
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

export const HERODOTUS_ADDRESS = {
  [intMainnetId]: process.env.REACT_APP_HERODOTUS_MAINNET || '', // ==================
  [intTestnetId]: process.env.REACT_APP_HERODOTUS_TESTNET || '',
}

export const DAI = new Token(intMainnetId, '0xf24400CA87E2260FaA63233c2Be8e4259B214E4E', 18, 'KDAI', 'Dai Stablecoin')
// export const BUSD = new Token(intMainnetId, '0xe9e7cea3dedca5984780bafc599bd69add087d56', 18, 'BUSD', 'Binance USD')
export const USDT = new Token(intMainnetId, '0x72f58bF36Ce713D408a854C060FbF89A25F87C4C', 18, 'KUSDT', 'Tether USD')
// export const UST = new Token(
//   intMainnetId,
//   '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
//   18,
//   'UST',
//   'Wrapped UST Token'
// )

const WETH_ONLY = {
  [intMainnetId]: [WETH(intMainnetId)],
  [intTestnetId]: [WETH(intTestnetId)],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST = {
  ...WETH_ONLY,
  [intTestnetId]: [
    new Token(intTestnetId, SIX_ADDRESS[intTestnetId], 18, 'SIX', 'SIX Token'),
    new Token(intTestnetId, FINIX_ADDRESS[intTestnetId], 18, 'FINIX', 'FINIX Token'),
    new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    new Token(intTestnetId, WKLAY_ADDRESS[intTestnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    new Token(intTestnetId, KSP_ADDRESS[intTestnetId], 18, 'KSP', 'KLAY Swap Protocol'),
    new Token(intTestnetId, KDAI_ADDRESS[intTestnetId], 18, 'KDAI', 'KDAI Token'),
    new Token(intTestnetId, OETH_ADDRESS[intTestnetId], 18, 'oETH', 'oETH Token'),
    new Token(intTestnetId, KWBTC_ADDRESS[intTestnetId], 18, 'KWBTC', 'KWBTC Token'),
    new Token(intTestnetId, OXRP_ADDRESS[intTestnetId], 18, 'oXRP', 'oXRP Token'),
    new Token(intTestnetId, KBNB_ADDRESS[intTestnetId], 18, 'KBNB', 'KBNB Token'),
    new Token(intTestnetId, FAVOR_ADDRESS[intTestnetId], 18, 'FAVOR', 'FAVOR Token')
  ],
  [intMainnetId]: [
    ...WETH_ONLY[intMainnetId],
    DAI,
    USDT,
    new Token(intMainnetId, SIX_ADDRESS[intMainnetId], 18, 'SIX', 'SIX Token'),
    new Token(intMainnetId, FINIX_ADDRESS[intMainnetId], 18, 'FINIX', 'FINIX Token'),
    new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    new Token(intMainnetId, WKLAY_ADDRESS[intMainnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    new Token(intMainnetId, KSP_ADDRESS[intMainnetId], 18, 'KSP', 'KLAY Swap Protocol'),
    new Token(intMainnetId, KDAI_ADDRESS[intMainnetId], 18, 'KDAI', 'KDAI Token'),
    new Token(intMainnetId, KWBTC_ADDRESS[intMainnetId], 18, 'KWBTC', 'KWBTC Token'),
    new Token(intMainnetId, OETH_ADDRESS[intMainnetId], 18, 'oETH', 'oETH Token'),
    new Token(intMainnetId, OXRP_ADDRESS[intMainnetId], 18, 'oXRP', 'oXRP Token'),
    new Token(intMainnetId, KBNB_ADDRESS[intMainnetId], 18, 'KBNB', 'KBNB Token'),
    new Token(intMainnetId, FAVOR_ADDRESS[intMainnetId], 18, 'FAVOR', 'FAVOR Token')
  ],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES = {
  [intMainnetId]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES = {
  ...WETH_ONLY,
  [intMainnetId]: [...WETH_ONLY[intMainnetId], DAI, USDT],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR = {
  ...WETH_ONLY,
  [intMainnetId]: [...WETH_ONLY[intMainnetId], DAI, USDT],
}

export const PINNED_PAIRS = {
  [intMainnetId]: [
    [
      new Token(intMainnetId, SIX_ADDRESS[intMainnetId], 18, 'SIX', 'SIX Token'),
      new Token(intMainnetId, FINIX_ADDRESS[intMainnetId], 18, 'FINIX', 'FINIX Token'),
    ],
    [
      new Token(intMainnetId, SIX_ADDRESS[intMainnetId], 18, 'SIX', 'SIX Token'),
      new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intMainnetId, SIX_ADDRESS[intMainnetId], 18, 'SIX', 'SIX Token'),
      new Token(intMainnetId, WKLAY_ADDRESS[intMainnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intMainnetId, FINIX_ADDRESS[intMainnetId], 18, 'FINIX', 'FINIX Token'),
      new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intMainnetId, FINIX_ADDRESS[intMainnetId], 18, 'FINIX', 'FINIX Token'),
      new Token(intMainnetId, WKLAY_ADDRESS[intMainnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intMainnetId, FINIX_ADDRESS[intMainnetId], 18, 'FINIX', 'FINIX Token'),
      new Token(intMainnetId, KSP_ADDRESS[intMainnetId], 18, 'KSP', 'KLAY Swap Protocol'),
    ],
    [
      new Token(intMainnetId, WKLAY_ADDRESS[intMainnetId], 18, 'WKLAY', 'Wrapped KLAY'),
      new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intMainnetId, KDAI_ADDRESS[intMainnetId], 18, 'KDAI', 'KDAI Token'),
      new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intMainnetId, OETH_ADDRESS[intMainnetId], 18, 'oETH', 'oETH Token'),
      new Token(intMainnetId, WKLAY_ADDRESS[intMainnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intMainnetId, KWBTC_ADDRESS[intMainnetId], 18, 'KWBTC', 'KWBTC Token'),
      new Token(intMainnetId, WKLAY_ADDRESS[intMainnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intMainnetId, OXRP_ADDRESS[intMainnetId], 18, 'OXRP', 'OXRP Token'),
      new Token(intMainnetId, WKLAY_ADDRESS[intMainnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intMainnetId, OETH_ADDRESS[intMainnetId], 18, 'oETH', 'oETH Token'),
      new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intMainnetId, KWBTC_ADDRESS[intMainnetId], 18, 'KWBTC', 'KWBTC Token'),
      new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intMainnetId, OXRP_ADDRESS[intMainnetId], 18, 'OXRP', 'OXRP Token'),
      new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intMainnetId, KBNB_ADDRESS[intMainnetId], 18, 'KBNB', 'KBNB Token'),
      new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intMainnetId, KBNB_ADDRESS[intMainnetId], 18, 'KBNB', 'KBNB Token'),
      new Token(intMainnetId, FINIX_ADDRESS[intMainnetId], 18, 'FINIX', 'FINIX Token'),
    ],
    [
      new Token(intMainnetId, FAVOR_ADDRESS[intMainnetId], 18, 'Favor', 'Favor Token'),
      new Token(intMainnetId, OUSDT_ADDRESS[intMainnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intMainnetId, FAVOR_ADDRESS[intMainnetId], 18, 'Favor', 'Favor Token'),
      new Token(intMainnetId, SIX_ADDRESS[intMainnetId], 18, 'SIX', 'SIX Token'),
    ],
    [
      new Token(intMainnetId, FAVOR_ADDRESS[intMainnetId], 18, 'Favor', 'Favor Token'),
      new Token(intMainnetId, FINIX_ADDRESS[intMainnetId], 18, 'FINIX', 'FINIX Token'),
    ],
    [
      new Token(intMainnetId, FAVOR_ADDRESS[intMainnetId], 18, 'Favor', 'Favor Token'),
      new Token(intMainnetId, WKLAY_ADDRESS[intMainnetId], 18, 'KLAY', 'KLAY Token'),
    ],
  ],
  [intTestnetId]: [
    [
      new Token(intTestnetId, SIX_ADDRESS[intTestnetId], 18, 'SIX', 'SIX Token'),
      new Token(intTestnetId, FINIX_ADDRESS[intTestnetId], 18, 'FINIX', 'FINIX Token'),
    ],
    [
      new Token(intTestnetId, SIX_ADDRESS[intTestnetId], 18, 'SIX', 'SIX Token'),
      new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intTestnetId, SIX_ADDRESS[intTestnetId], 18, 'SIX', 'SIX Token'),
      new Token(intTestnetId, WKLAY_ADDRESS[intTestnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intTestnetId, FINIX_ADDRESS[intTestnetId], 18, 'FINIX', 'FINIX Token'),
      new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intTestnetId, FINIX_ADDRESS[intTestnetId], 18, 'FINIX', 'FINIX Token'),
      new Token(intTestnetId, WKLAY_ADDRESS[intTestnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intTestnetId, FINIX_ADDRESS[intTestnetId], 18, 'FINIX', 'FINIX Token'),
      new Token(intTestnetId, KSP_ADDRESS[intTestnetId], 18, 'KSP', 'KLAY Swap Protocol'),
    ],
    [
      new Token(intTestnetId, WKLAY_ADDRESS[intTestnetId], 18, 'WKLAY', 'Wrapped KLAY'),
      new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intTestnetId, KDAI_ADDRESS[intTestnetId], 18, 'KDAI', 'KDAI Token'),
      new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intTestnetId, OETH_ADDRESS[intTestnetId], 18, 'oETH', 'oETH Token'),
      new Token(intTestnetId, WKLAY_ADDRESS[intTestnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intTestnetId, KWBTC_ADDRESS[intTestnetId], 18, 'KWBTC', 'KWBTC Token'),
      new Token(intTestnetId, WKLAY_ADDRESS[intTestnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intTestnetId, OXRP_ADDRESS[intTestnetId], 18, 'OXRP', 'OXRP Token'),
      new Token(intTestnetId, WKLAY_ADDRESS[intTestnetId], 18, 'WKLAY', 'Wrapped KLAY'),
    ],
    [
      new Token(intTestnetId, OETH_ADDRESS[intTestnetId], 18, 'oETH', 'oETH Token'),
      new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intTestnetId, KWBTC_ADDRESS[intTestnetId], 18, 'KWBTC', 'KWBTC Token'),
      new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intTestnetId, OXRP_ADDRESS[intTestnetId], 18, 'OXRP', 'OXRP Token'),
      new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intTestnetId, KBNB_ADDRESS[intTestnetId], 18, 'KBNB', 'KBNB Token'),
      new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intTestnetId, KBNB_ADDRESS[intTestnetId], 18, 'KBNB', 'KBNB Token'),
      new Token(intTestnetId, FINIX_ADDRESS[intTestnetId], 18, 'FINIX', 'FINIX Token'),
    ],
    [
      new Token(intTestnetId, FAVOR_ADDRESS[intTestnetId], 18, 'Favor', 'Favor Token'),
      new Token(intTestnetId, OUSDT_ADDRESS[intTestnetId], 18, 'oUSDT', 'oUSDT Token'),
    ],
    [
      new Token(intTestnetId, FAVOR_ADDRESS[intTestnetId], 18, 'Favor', 'Favor Token'),
      new Token(intTestnetId, SIX_ADDRESS[intTestnetId], 18, 'SIX', 'SIX Token'),
    ],
    [
      new Token(intTestnetId, FAVOR_ADDRESS[intTestnetId], 18, 'Favor', 'Favor Token'),
      new Token(intTestnetId, FINIX_ADDRESS[intTestnetId], 18, 'FINIX', 'FINIX Token'),
    ],
    [
      new Token(intTestnetId, FAVOR_ADDRESS[intTestnetId], 18, 'Favor', 'Favor Token'),
      new Token(intTestnetId, WKLAY_ADDRESS[intTestnetId], 18, 'KLAY', 'KLAY Token'),
    ],
  ],
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 80
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%
export const LIMITED_PRICE_IMPACT: Percent = new Percent(JSBI.BigInt(6000), BIPS_BASE) // 60%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
