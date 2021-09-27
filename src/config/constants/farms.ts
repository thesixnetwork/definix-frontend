import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'FINIX',
    lpAddresses: {
      97: process.env.REACT_APP_FINIX_ADDRESS_TESTNET,
      56: process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
    },
    tokenSymbol: 'FINIX',
    tokenAddresses: {
      97: process.env.REACT_APP_FINIX_ADDRESS_TESTNET,
      56: process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.SIX,
    quoteTokenAdresses: contracts.six,
  },
  {
    pid: 1,
    lpSymbol: 'FINIX-SIX LP',
    lpAddresses: {
      97: process.env.REACT_APP_FINIX_SIX_LP_TESTNET,
      56: process.env.REACT_APP_FINIX_SIX_LP_MAINNET,
    },
    tokenSymbol: 'SIX',
    tokenAddresses: {
      97: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
      56: process.env.REACT_APP_SIX_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
  },
  {
    pid: 2,
    lpSymbol: 'FINIX-BUSD LP',
    lpAddresses: {
      97: process.env.REACT_APP_FINIX_BUSD_LP_TESTNET,
      56: process.env.REACT_APP_FINIX_BUSD_LP_MAINNET,
    },
    tokenSymbol: 'BUSD',
    tokenAddresses: {
      97: process.env.REACT_APP_BUSD_ADDRESS_TESTNET,
      56: process.env.REACT_APP_BUSD_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
  },
  {
    pid: 3,
    lpSymbol: 'FINIX-BNB LP',
    lpAddresses: {
      97: process.env.REACT_APP_FINIX_BNB_LP_TESTNET,
      56: process.env.REACT_APP_FINIX_BNB_LP_MAINNET,
    },
    tokenSymbol: 'FINIX',
    tokenAddresses: {
      97: process.env.REACT_APP_FINIX_ADDRESS_TESTNET,
      56: process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.FINIX,
    quoteTokenAdresses: contracts.finix,
  },
  {
    pid: 4,
    lpSymbol: 'SIX-BUSD LP',
    lpAddresses: {
      97: process.env.REACT_APP_SIX_BUSD_LP_TESTNET,
      56: process.env.REACT_APP_SIX_BUSD_LP_MAINNET,
    },
    tokenSymbol: 'SIX',
    tokenAddresses: {
      97: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
      56: process.env.REACT_APP_SIX_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 5,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: process.env.REACT_APP_USDT_BUSD_LP_TESTNET,
      56: process.env.REACT_APP_USDT_BUSD_LP_MAINNET,
    },
    tokenSymbol: 'USDT',
    tokenAddresses: {
      97: process.env.REACT_APP_USDT_ADDRESS_TESTNET,
      56: process.env.REACT_APP_USDT_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 6,
    lpSymbol: 'SIX-BNB LP',
    lpAddresses: {
      97: process.env.REACT_APP_SIX_BNB_LP_TESTNET,
      56: process.env.REACT_APP_SIX_BNB_LP_MAINNET,
    },
    tokenSymbol: 'SIX',
    tokenAddresses: {
      97: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
      56: process.env.REACT_APP_SIX_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 7,
    lpSymbol: 'BNB-BUSD LP',
    lpAddresses: {
      97: process.env.REACT_APP_BNB_BUSD_LP_TESTNET,
      56: process.env.REACT_APP_BNB_BUSD_LP_MAINNET,
    },
    tokenSymbol: 'BNB',
    tokenAddresses: {
      97: process.env.REACT_APP_WBNB_ADDRESS_TESTNET,
      56: process.env.REACT_APP_WBNB_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 8,
    lpSymbol: 'BNB-BTCB LP',
    lpAddresses: {
      97: process.env.REACT_APP_BNB_BTCB_LP_TESTNET,
      56: process.env.REACT_APP_BNB_BTCB_LP_MAINNET,
    },
    tokenSymbol: 'BTCB',
    tokenAddresses: {
      97: process.env.REACT_APP_BTCB_ADDRESS_TESTNET,
      56: process.env.REACT_APP_BTCB_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 9,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: process.env.REACT_APP_ETH_BNB_LP_TESTNET,
      56: process.env.REACT_APP_ETH_BNB_LP_MAINNET,
    },
    tokenSymbol: 'ETH',
    tokenAddresses: {
      97: process.env.REACT_APP_ETH_ADDRESS_TESTNET,
      56: process.env.REACT_APP_ETH_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 10,
    lpSymbol: 'XRP-BNB LP',
    lpAddresses: {
      97: process.env.REACT_APP_XRP_BNB_LP_TESTNET,
      56: process.env.REACT_APP_XRP_BNB_LP_MAINNET,
    },
    tokenSymbol: 'XRP',
    tokenAddresses: {
      97: process.env.REACT_APP_XRP_ADDRESS_TESTNET,
      56: process.env.REACT_APP_XRP_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 11,
    lpSymbol: 'ADA-BNB LP',
    lpAddresses: {
      97: process.env.REACT_APP_ADA_BNB_LP_TESTNET,
      56: process.env.REACT_APP_ADA_BNB_LP_MAINNET,
    },
    tokenSymbol: 'ADA',
    tokenAddresses: {
      97: process.env.REACT_APP_ADA_ADDRESS_TESTNET,
      56: process.env.REACT_APP_ADA_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 12,
    lpSymbol: 'ETH-BTCB LP',
    lpAddresses: {
      97: process.env.REACT_APP_ETH_BTCB_LP_TESTNET,
      56: process.env.REACT_APP_ETH_BTCB_LP_MAINNET,
    },
    tokenSymbol: 'BTCB',
    tokenAddresses: {
      97: process.env.REACT_APP_BTCB_ADDRESS_TESTNET,
      56: process.env.REACT_APP_BTCB_ADDRESS_MAINNET,
    },
    quoteTokenSymbol: QuoteToken.ETH,
    quoteTokenAdresses: contracts.eth,
  },
]

export default farms
