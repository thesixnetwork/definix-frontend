import { PoolConfig, QuoteToken, PoolCategory } from './types'

const VeloPool: PoolConfig = 
  {
    sousId: 0,
    tokenName: 'FINIX',
    stakingTokenName: QuoteToken.FINIX,
    stakingTokenAddress:
      process.env.REACT_APP_CHAIN_ID === '97'
        ? "0xD6F0Cad4d2c9a6716502CDa4fFC9227768F940A1"
        : process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
    contractAddress: {
      97: "0xABc47aaEF71A60b69Be40B6E192EB82212005fCf",
      56: process.env.REACT_APP_HERODOTUS_MAINNET,
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
