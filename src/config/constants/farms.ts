import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'
import {
  SIX,
  FINIX,
  WKLAY,
  KUSDT,
  KDAI,
  KETH,
  KWBTC,
  KXRP,
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
    tag: 'New'
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
    tag: 'New'
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
    tag: 'New'
  },
  {
    pid: 5,
    lpSymbol: 'FINIX-KUSDT LP',
    lpAddresses: getLpNetwork(FINIX, KUSDT),
    tokenSymbol: 'KUSDT',
    tokenAddresses: KUSDT,
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstToken: contracts.finix,
    secondToken: contracts.kusdt,
  },
  {
    pid: 6,
    lpSymbol: 'SIX-KUSDT LP',
    lpAddresses: getLpNetwork(SIX, KUSDT),
    tokenSymbol: 'SIX',
    tokenAddresses: SIX,
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstToken: contracts.six,
    secondToken: contracts.kusdt,
  },
  {
    pid: 7,
    lpSymbol: 'SIX-KLAY LP',
    lpAddresses: getLpNetwork(SIX, WKLAY),
    tokenSymbol: 'SIX',
    tokenAddresses: SIX,
    quoteTokenSymbol: QuoteToken.SIX,
    quoteTokenAdresses: contracts.six,
    firstToken: contracts.six,
    secondToken: contracts.wklay,
  },
  {
    pid: 8,
    lpSymbol: 'KLAY-KETH LP',
    lpAddresses: getLpNetwork(WKLAY, KETH),
    tokenSymbol: 'KETH',
    tokenAddresses: KETH,
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstToken: contracts.wklay,
    secondToken: contracts.keth,
  },
  {
    pid: 9,
    lpSymbol: 'KLAY-KWBTC LP',
    lpAddresses: getLpNetwork(WKLAY, KWBTC),
    tokenSymbol: 'KWBTC',
    tokenAddresses: KWBTC,
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstToken: contracts.wklay,
    secondToken: contracts.kwbtc,
  },
  {
    pid: 10,
    lpSymbol: 'KLAY-KXRP LP',
    lpAddresses: getLpNetwork(WKLAY, KXRP),
    tokenSymbol: 'KXRP',
    tokenAddresses: KXRP,
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstToken: contracts.wklay,
    secondToken: contracts.kxrp,
  },
  {
    pid: 11,
    lpSymbol: 'KETH-KUSDT LP',
    lpAddresses: getLpNetwork(KETH, KUSDT),
    tokenSymbol: 'KETH',
    tokenAddresses: KETH,
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstToken: contracts.keth,
    secondToken: contracts.kusdt,
  },
  {
    pid: 12,
    lpSymbol: 'KWBTC-KUSDT LP',
    lpAddresses: getLpNetwork(KWBTC, KUSDT),
    tokenSymbol: 'KWBTC',
    tokenAddresses: KWBTC,
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstToken: contracts.kwbtc,
    secondToken: contracts.kusdt,
  },
  {
    pid: 13,
    lpSymbol: 'KXRP-KUSDT LP',
    lpAddresses: getLpNetwork(KXRP, KUSDT),
    tokenSymbol: 'KXRP',
    tokenAddresses: KXRP,
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstToken: contracts.kxrp,
    secondToken: contracts.kusdt,
  },
  {
    pid: 14,
    lpSymbol: 'KLAY-KUSDT LP',
    lpAddresses: getLpNetwork(WKLAY, KUSDT),
    tokenSymbol: 'KLAY',
    tokenAddresses: WKLAY,
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstToken: contracts.wklay,
    secondToken: contracts.kusdt,
  },
  {
    pid: 15,
    lpSymbol: 'KDAI-KUSDT LP',
    lpAddresses: getLpNetwork(KDAI, KUSDT),
    tokenSymbol: 'KDAI',
    tokenAddresses: KDAI,
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstToken: contracts.kdai,
    secondToken: contracts.kusdt,
  },
  {
    pid: 16,
    lpSymbol: 'KBNB-KUSDT LP',
    lpAddresses: getLpNetwork(KBNB, KUSDT),
    tokenSymbol: 'KBNB',
    tokenAddresses: KBNB,
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstToken: contracts.kbnb,
    secondToken: contracts.kusdt,
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
