import { PoolConfig, QuoteToken, PoolCategory } from './types'

const VeloPool: PoolConfig = {
  sousId: 0,
  tokenName: 'FINIX',
  stakingTokenName: QuoteToken.FINIX,
  stakingTokenAddress:
    process.env.REACT_APP_CHAIN_ID === '97'
      ? process.env.REACT_APP_FINIX_ADDRESS_TESTNET
      : process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
  contractAddress: {
    97: process.env.REACT_APP_VELO_APOLLO_TESTNET,
    56: process.env.REACT_APP_VELO_APOLLO_MAINNET,
  },
  poolCategory: PoolCategory.CORE,
  projectLink: 'https://definix.com/',
  harvest: true,
  tokenPerBlock: '10',
  sortOrder: 1,
  isFinished: false,
  tokenDecimals: 18,
}

export default VeloPool
