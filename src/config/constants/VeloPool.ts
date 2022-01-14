import { PoolConfig, QuoteToken, PoolCategory } from './types'

const VeloPool: PoolConfig[] = [
  {
    sousId: 99,
    tokenName: 'FINIX',
    stakingTokenName: QuoteToken.FINIX,
    stakingTokenAddress:
      process.env.REACT_APP_CHAIN_ID === '97'
        ? process.env.REACT_APP_FINIX_ADDRESS_TESTNET
        : process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
    contractAddress: {
      97: '0x7ddc1bD516256c269F99AD52D7C37DeD33AF0eE7',
      56: '0x7ddc1bD516256c269F99AD52D7C37DeD33AF0eE7',
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://definix.com/',
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 5,
  },
  {
    sousId: 100,
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
  },
  {
    sousId: 101,
    tokenName: 'FINIX',
    stakingTokenName: QuoteToken.FINIX,
    stakingTokenAddress:
      process.env.REACT_APP_CHAIN_ID === '97'
        ? process.env.REACT_APP_FINIX_ADDRESS_TESTNET
        : process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
    contractAddress: {
      97: '0x32971Dd884E4010356cFfD26B819f553A1aD1a71', // new config
      56: '0x32971Dd884E4010356cFfD26B819f553A1aD1a71',
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

export default VeloPool
