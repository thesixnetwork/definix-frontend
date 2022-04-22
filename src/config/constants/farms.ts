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
  FAVOR,
} from './tokens'

const farms: FarmConfig[] = [
  /**
   * @favor
   */
   {
    pid: 93,
    lpSymbol: 'FAVOR-KUSDT LP',
    lpAddresses: getLpNetwork(FAVOR, KUSDT),
    tokenSymbol: 'FAVOR',
    tokenAddresses: FAVOR,
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstToken: contracts.favor,
    secondToken: contracts.kusdt,
    firstSymbol: QuoteToken.FAVOR,
    secondSymbol: QuoteToken.KUSDT,
    tag: 'special',
  },
  {
    pid: 94,
    lpSymbol: 'FAVOR-KLAY LP',
    lpAddresses: getLpNetwork(FAVOR, WKLAY),
    tokenSymbol: 'FAVOR',
    tokenAddresses: FAVOR,
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstToken: contracts.favor,
    secondToken: contracts.wklay,
    firstSymbol: QuoteToken.FAVOR,
    secondSymbol: QuoteToken.KLAY,
    tag: 'special',
  },
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
    firstSymbol: QuoteToken.FINIX,
    secondSymbol: QuoteToken.SIX,
    tag: 'hot',
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
    firstSymbol: QuoteToken.FINIX,
    secondSymbol: QuoteToken.KLAY,
    tag: 'hot',
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
    lpSymbol: 'FINIX-KUSDT LP',
    lpAddresses: getLpNetwork(FINIX, KUSDT),
    tokenSymbol: 'KUSDT',
    tokenAddresses: KUSDT,
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstToken: contracts.finix,
    secondToken: contracts.kusdt,
    firstSymbol: QuoteToken.FINIX,
    secondSymbol: QuoteToken.KUSDT,
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
    firstSymbol: QuoteToken.SIX,
    secondSymbol: QuoteToken.KUSDT,
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
    firstSymbol: QuoteToken.SIX,
    secondSymbol: QuoteToken.KLAY,
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
    firstSymbol: QuoteToken.KLAY,
    secondSymbol: QuoteToken.KETH,
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
    firstSymbol: QuoteToken.KLAY,
    secondSymbol: QuoteToken.KWBTC,
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
    firstSymbol: QuoteToken.KLAY,
    secondSymbol: QuoteToken.KXRP,
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
    firstSymbol: QuoteToken.KETH,
    secondSymbol: QuoteToken.KUSDT,
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
    firstSymbol: QuoteToken.KWBTC,
    secondSymbol: QuoteToken.KUSDT,
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
    firstSymbol: QuoteToken.KXRP,
    secondSymbol: QuoteToken.KUSDT,
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
    firstSymbol: QuoteToken.KLAY,
    secondSymbol: QuoteToken.KUSDT,
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
    firstSymbol: QuoteToken.KDAI,
    secondSymbol: QuoteToken.KUSDT,
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
    firstSymbol: QuoteToken.KBNB,
    secondSymbol: QuoteToken.KUSDT,
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
    firstSymbol: QuoteToken.KBNB,
    secondSymbol: QuoteToken.FINIX,
  },
]

export const FAVOR_FARMS = farms.filter(({ tokenSymbol, firstSymbol, secondSymbol }) => tokenSymbol === 'FAVOR' || firstSymbol === QuoteToken.FAVOR || secondSymbol === QuoteToken.FAVOR)

export default farms
