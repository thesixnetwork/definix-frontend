import { PoolConfig, QuoteToken, PoolCategory } from './types'

const VeloPool: PoolConfig = {
  sousId: 99,
  tokenName: 'FINIX',
  stakingTokenName: QuoteToken.FINIX,
  stakingTokenAddress:
    process.env.REACT_APP_CHAIN_ID === '97'
      ? process.env.REACT_APP_FINIX_ADDRESS_TESTNET
      : process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
  contractAddress: {
    97: '0xd8E92beadEe1fF2Ba550458cd0c30B9D139F3E0f',
    56: '0xd8E92beadEe1fF2Ba550458cd0c30B9D139F3E0f',
  },
  poolCategory: PoolCategory.CORE,
  projectLink: 'https://definix.com/',
  harvest: true,
  tokenPerBlock: '10',
  sortOrder: 1,
  isFinished: false,
  tokenDecimals: 5,
}

export default VeloPool
