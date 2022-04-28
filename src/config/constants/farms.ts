import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'
import {
  SIX,
  FINIX,
  WKLAY,
  oUSDT,
  KDAI,
  oETH,
  oWBTC,
  oXRP,
  KBNB,
  KSP,
  getLpNetwork,
  getSingleLpNetwork,
} from './tokens'

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'FINIX',
    lpAddresses: getSingleLpNetwork(FINIX),
    tokenSymbol: 'FINIX',
    tokenAddresses: FINIX,
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
  },
  {
    pid: 1,
    lpSymbol: 'SIX',
    lpAddresses: getSingleLpNetwork(SIX),
    tokenSymbol: 'SIX',
    tokenAddresses: SIX,
    quoteTokenSymbol: QuoteToken.SIX,
    quoteTokenAdresses: contracts.six,
  },
  {
    pid: 2,
    lpSymbol: 'FINIX-SIX LP',
    lpAddresses: getLpNetwork(FINIX, SIX),
    tokenSymbol: 'SIX',
    tokenAddresses: SIX,
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstToken: contracts.finix,
    secondToken: contracts.six,
  },
  {
    pid: 3,
    lpSymbol: 'FINIX-KLAY LP',
    lpAddresses: getLpNetwork(FINIX, WKLAY),
    tokenSymbol: 'KLAY',
    tokenAddresses: WKLAY,
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstToken: contracts.finix,
    secondToken: contracts.wklay,
  },
  {
    pid: 4,
    lpSymbol: 'FINIX-KSP LP',
    lpAddresses: getLpNetwork(FINIX, KSP),
    tokenSymbol: 'KSP',
    tokenAddresses: KSP,
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstToken: contracts.finix,
    secondToken: contracts.ksp,
  },
  {
    pid: 5,
    lpSymbol: 'FINIX-oUSDT LP',
    lpAddresses: getLpNetwork(FINIX, oUSDT),
    tokenSymbol: 'oUSDT',
    tokenAddresses: oUSDT,
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstToken: contracts.finix,
    secondToken: contracts.ousdt,
  },
  {
    pid: 6,
    lpSymbol: 'SIX-oUSDT LP',
    lpAddresses: getLpNetwork(SIX, oUSDT),
    tokenSymbol: 'SIX',
    tokenAddresses: SIX,
    quoteTokenSymbol: QuoteToken.oUSDT,
    quoteTokenAdresses: contracts.ousdt,
    firstToken: contracts.six,
    secondToken: contracts.ousdt,
  },
  {
    pid: 7,
    lpSymbol: 'SIX-KLAY LP',
    lpAddresses: getLpNetwork(SIX, WKLAY),
    tokenSymbol: 'KLAY',
    tokenAddresses: WKLAY,
    quoteTokenSymbol: QuoteToken.SIX,
    quoteTokenAdresses: contracts.six,
    firstToken: contracts.six,
    secondToken: contracts.wklay,
  },
  {
    pid: 8,
    lpSymbol: 'KLAY-oETH LP',
    lpAddresses: getLpNetwork(WKLAY, oETH),
    tokenSymbol: 'oETH',
    tokenAddresses: oETH,
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstToken: contracts.wklay,
    secondToken: contracts.oeth,
  },
  {
    pid: 9,
    lpSymbol: 'KLAY-oWBTC LP',
    lpAddresses: getLpNetwork(WKLAY, oWBTC),
    tokenSymbol: 'oWBTC',
    tokenAddresses: oWBTC,
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstToken: contracts.wklay,
    secondToken: contracts.owbtc,
  },
  {
    pid: 10,
    lpSymbol: 'KLAY-oXRP LP',
    lpAddresses: getLpNetwork(WKLAY, oXRP),
    tokenSymbol: 'oXRP',
    tokenAddresses: oXRP,
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstToken: contracts.wklay,
    secondToken: contracts.oxrp,
  },
  {
    pid: 11,
    lpSymbol: 'oETH-oUSDT LP',
    lpAddresses: getLpNetwork(oETH, oUSDT),
    tokenSymbol: 'oETH',
    tokenAddresses: oETH,
    quoteTokenSymbol: QuoteToken.oUSDT,
    quoteTokenAdresses: contracts.ousdt,
    firstToken: contracts.oeth,
    secondToken: contracts.ousdt,
  },
  {
    pid: 12,
    lpSymbol: 'oWBTC-oUSDT LP',
    lpAddresses: getLpNetwork(oWBTC, oUSDT),
    tokenSymbol: 'oWBTC',
    tokenAddresses: oWBTC,
    quoteTokenSymbol: QuoteToken.oUSDT,
    quoteTokenAdresses: contracts.ousdt,
    firstToken: contracts.owbtc,
    secondToken: contracts.ousdt,
  },
  {
    pid: 13,
    lpSymbol: 'oXRP-oUSDT LP',
    lpAddresses: getLpNetwork(oXRP, oUSDT),
    tokenSymbol: 'oXRP',
    tokenAddresses: oXRP,
    quoteTokenSymbol: QuoteToken.oUSDT,
    quoteTokenAdresses: contracts.ousdt,
    firstToken: contracts.oxrp,
    secondToken: contracts.ousdt,
  },
  {
    pid: 14,
    lpSymbol: 'KLAY-oUSDT LP',
    lpAddresses: getLpNetwork(WKLAY, oUSDT),
    tokenSymbol: 'KLAY',
    tokenAddresses: WKLAY,
    quoteTokenSymbol: QuoteToken.oUSDT,
    quoteTokenAdresses: contracts.ousdt,
    firstToken: contracts.wklay,
    secondToken: contracts.ousdt,
  },
  {
    pid: 15,
    lpSymbol: 'KDAI-oUSDT LP',
    lpAddresses: getLpNetwork(KDAI, oUSDT),
    tokenSymbol: 'KDAI',
    tokenAddresses: KDAI,
    quoteTokenSymbol: QuoteToken.oUSDT,
    quoteTokenAdresses: contracts.ousdt,
    firstToken: contracts.kdai,
    secondToken: contracts.ousdt,
  },
  {
    pid: 16,
    lpSymbol: 'KBNB-oUSDT LP',
    lpAddresses: getLpNetwork(KBNB, oUSDT),
    tokenSymbol: 'KBNB',
    tokenAddresses: KBNB,
    quoteTokenSymbol: QuoteToken.oUSDT,
    quoteTokenAdresses: contracts.ousdt,
    firstToken: contracts.kbnb,
    secondToken: contracts.ousdt,
  },
  {
    pid: 17,
    lpSymbol: 'KBNB-FINIX LP',
    lpAddresses: getLpNetwork(KBNB, FINIX),
    tokenSymbol: 'KBNB',
    tokenAddresses: KBNB,
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstToken: contracts.kbnb,
    secondToken: contracts.finix,
  },
]

export default farms
