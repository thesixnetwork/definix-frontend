import { PoolConfig, QuoteToken, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 1,
    tokenName: 'SIX',
    stakingTokenName: QuoteToken.SIX,
    stakingTokenAddress:
      process.env.REACT_APP_CHAIN_ID === '97'
        ? process.env.REACT_APP_SIX_ADDRESS_TESTNET
        : process.env.REACT_APP_SIX_ADDRESS_MAINNET,
    contractAddress: {
      97: process.env.REACT_APP_GENESIS_CONTRACT_ADDRESS_TESTNET,
      56: process.env.REACT_APP_GENESIS_CONTRACT_ADDRESS_MAINNET,
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://definix.com/',
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
  },
]

export default pools
