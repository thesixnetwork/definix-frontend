import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'FINIX',
    lpAddresses: {
      1001: process.env.REACT_APP_FINIX_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_FINIX_ADDRESS_MAINNET
    },
    tokenSymbol: 'FINIX',
    tokenAddresses: {
      1001: process.env.REACT_APP_FINIX_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_FINIX_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.SIX,
    quoteTokenAdresses: contracts.six
  },
  {
    pid: 1,
    lpSymbol: 'SIX',
    lpAddresses: {
      1001: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_SIX_ADDRESS_MAINNET
    },
    tokenSymbol: 'SIX',
    tokenAddresses: {
      1001: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_SIX_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix
  },
  {
    pid: 2,
    lpSymbol: 'FINIX-SIX LP',
    lpAddresses: {
      1001: process.env.REACT_APP_FINIX_SIX_LP_TESTNET,
      8217: process.env.REACT_APP_FINIX_SIX_LP_MAINNET
    },
    tokenSymbol: 'SIX',
    tokenAddresses: {
      1001: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_SIX_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstSymbol: QuoteToken.FINIX,
    secondSymbol: QuoteToken.SIX,
  },
  {
    pid: 3,
    lpSymbol: 'FINIX-KLAY LP',
    lpAddresses: {
      1001: process.env.REACT_APP_FINIX_KLAY_LP_TESTNET,
      8217: process.env.REACT_APP_FINIX_KLAY_LP_MAINNET
    },
    tokenSymbol: 'KLAY',
    tokenAddresses: {
      1001: process.env.REACT_APP_WKLAY_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_WKLAY_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstSymbol: QuoteToken.FINIX,
    secondSymbol: QuoteToken.KLAY,
  },
  {
    pid: 4,
    lpSymbol: 'FINIX-KSP LP',
    lpAddresses: {
      1001: process.env.REACT_APP_FINIX_KSP_LP_TESTNET,
      8217: process.env.REACT_APP_FINIX_KSP_LP_MAINNET
    },
    tokenSymbol: 'KSP',
    tokenAddresses: {
      1001: process.env.REACT_APP_KSP_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KSP_ADDRESS_TESTNET
    },
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstSymbol: QuoteToken.FINIX,
    secondSymbol: QuoteToken.KSP,
  },
  {
    pid: 5,
    lpSymbol: 'FINIX-KUSDT LP',
    lpAddresses: {
      1001: process.env.REACT_APP_FINIX_KUSDT_LP_TESTNET,
      8217: process.env.REACT_APP_FINIX_KUSDT_LP_MAINNET
    },
    tokenSymbol: 'KUSDT',
    tokenAddresses: {
      1001: process.env.REACT_APP_KUSDT_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KUSDT_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstSymbol: QuoteToken.FINIX,
    secondSymbol: QuoteToken.KUSDT,
  },
  {
    pid: 6,
    lpSymbol: 'SIX-KUSDT LP',
    lpAddresses: {
      1001: process.env.REACT_APP_SIX_KUSDT_LP_TESTNET,
      8217: process.env.REACT_APP_SIX_KUSDT_LP_MAINNET
    },
    tokenSymbol: 'SIX',
    tokenAddresses: {
      1001: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_SIX_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstSymbol: QuoteToken.SIX,
    secondSymbol: QuoteToken.KUSDT,
  },
  {
    pid: 7,
    lpSymbol: 'SIX-KLAY LP',
    lpAddresses: {
      1001: process.env.REACT_APP_SIX_KLAY_LP_TESTNET,
      8217: process.env.REACT_APP_SIX_KLAY_LP_MAINNET
    },
    tokenSymbol: 'SIX',
    tokenAddresses: {
      1001: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_SIX_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.SIX,
    quoteTokenAdresses: contracts.six,
    firstSymbol: QuoteToken.SIX,
    secondSymbol: QuoteToken.KLAY,
  },
  {
    pid: 8,
    lpSymbol: 'KLAY-KETH LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KLAY_KETH_LP_TESTNET,
      8217: process.env.REACT_APP_KLAY_KETH_LP_MAINNET
    },
    tokenSymbol: 'KETH',
    tokenAddresses: {
      1001: process.env.REACT_APP_KETH_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KETH_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstSymbol: QuoteToken.KLAY,
    secondSymbol: QuoteToken.KETH,
  },
  {
    pid: 9,
    lpSymbol: 'KLAY-KWBTC LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KLAY_KWBTC_LP_TESTNET,
      8217: process.env.REACT_APP_KLAY_KWBTC_LP_MAINNET
    },
    tokenSymbol: 'KWBTC',
    tokenAddresses: {
      1001: process.env.REACT_APP_KWBTC_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KWBTC_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstSymbol: QuoteToken.KLAY,
    secondSymbol: QuoteToken.KWBTC,
  },
  {
    pid: 10,
    lpSymbol: 'KLAY-KXRP LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KLAY_KXRP_LP_TESTNET,
      8217: process.env.REACT_APP_KLAY_KXRP_LP_MAINNET
    },
    tokenSymbol: 'KXRP',
    tokenAddresses: {
      1001: process.env.REACT_APP_KXRP_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KXRP_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KLAY,
    quoteTokenAdresses: contracts.wklay,
    firstSymbol: QuoteToken.KLAY,
    secondSymbol: QuoteToken.KXRP,
  },
  {
    pid: 11,
    lpSymbol: 'KETH-KUSDT LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KETH_KUSDT_LP_TESTNET,
      8217: process.env.REACT_APP_KETH_KUSDT_LP_MAINNET
    },
    tokenSymbol: 'KETH',
    tokenAddresses: {
      1001: process.env.REACT_APP_KETH_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KETH_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstSymbol: QuoteToken.KETH,
    secondSymbol: QuoteToken.KUSDT,
  },
  {
    pid: 12,
    lpSymbol: 'KWBTC-KUSDT LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KWBTC_KUSDT_LP_TESTNET,
      8217: process.env.REACT_APP_KWBTC_KUSDT_LP_MAINNET
    },
    tokenSymbol: 'KWBTC',
    tokenAddresses: {
      1001: process.env.REACT_APP_KWBTC_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KWBTC_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstSymbol: QuoteToken.KWBTC,
    secondSymbol: QuoteToken.KUSDT,
  },
  {
    pid: 13,
    lpSymbol: 'KXRP-KUSDT LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KXRP_KUSDT_LP_TESTNET,
      8217: process.env.REACT_APP_KXRP_KUSDT_LP_MAINNET
    },
    tokenSymbol: 'KXRP',
    tokenAddresses: {
      1001: process.env.REACT_APP_KXRP_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KXRP_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstSymbol: QuoteToken.KXRP,
    secondSymbol: QuoteToken.KUSDT,
  },
  {
    pid: 14,
    lpSymbol: 'KLAY-KUSDT LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KLAY_KUSDT_LP_TESTNET,
      8217: process.env.REACT_APP_KLAY_KUSDT_LP_MAINNET
    },
    tokenSymbol: 'KLAY',
    tokenAddresses: {
      1001: process.env.REACT_APP_WKLAY_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_WKLAY_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstSymbol: QuoteToken.KLAY,
    secondSymbol: QuoteToken.KUSDT,
  },
  {
    pid: 15,
    lpSymbol: 'KDAI-KUSDT LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KDAI_KUSDT_LP_TESTNET,
      8217: process.env.REACT_APP_KDAI_KUSDT_LP_MAINNET
    },
    tokenSymbol: 'KDAI',
    tokenAddresses: {
      1001: process.env.REACT_APP_KDAI_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KDAI_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstSymbol: QuoteToken.KDAI,
    secondSymbol: QuoteToken.KUSDT,
  },
  {
    pid: 16,
    lpSymbol: 'KBNB-KUSDT LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KBNB_KUSDT_LP_TESTNET,
      8217: process.env.REACT_APP_KBNB_KUSDT_LP_MAINNET
    },
    tokenSymbol: 'KBNB',
    tokenAddresses: {
      1001: process.env.REACT_APP_KBNB_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KBNB_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.KUSDT,
    quoteTokenAdresses: contracts.kusdt,
    firstSymbol: QuoteToken.KBNB,
    secondSymbol: QuoteToken.KUSDT,
  },
  {
    pid: 17,
    lpSymbol: 'KBNB-FINIX LP',
    lpAddresses: {
      1001: process.env.REACT_APP_KBNB_FINIX_LP_TESTNET,
      8217: process.env.REACT_APP_KBNB_FINIX_LP_MAINNET
    },
    tokenSymbol: 'KBNB',
    tokenAddresses: {
      1001: process.env.REACT_APP_KBNB_ADDRESS_TESTNET,
      8217: process.env.REACT_APP_KBNB_ADDRESS_MAINNET
    },
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
    firstSymbol: QuoteToken.KBNB,
    secondSymbol: QuoteToken.FINIX,
  }
]

export default farms
