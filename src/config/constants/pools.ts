import { PoolConfig, QuoteToken, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    tokenName: 'FINIX',
    stakingTokenName: QuoteToken.FINIX,
    stakingTokenAddress:
      process.env.REACT_APP_CHAIN_ID === '1001'
        ? process.env.REACT_APP_FINIX_ADDRESS_TESTNET
        : process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
    contractAddress: {
      1001: process.env.REACT_APP_HERODOTUS_TESTNET,
      8217: process.env.REACT_APP_HERODOTUS_MAINNET,
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://g2.klaytn.definix.com/',
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
  },
  {
    sousId: 1,
    tokenName: 'SIX',
    stakingTokenName: QuoteToken.SIX,
    stakingTokenAddress:
      process.env.REACT_APP_CHAIN_ID === '1001'
        ? process.env.REACT_APP_SIX_ADDRESS_TESTNET
        : process.env.REACT_APP_SIX_ADDRESS_MAINNET,
    contractAddress: {
      1001: process.env.REACT_APP_HERODOTUS_TESTNET,
      8217: process.env.REACT_APP_HERODOTUS_MAINNET,
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://g2.klaytn.definix.com/',
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
  },
]

export default pools
