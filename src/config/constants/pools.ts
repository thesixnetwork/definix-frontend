import { PoolConfig, QuoteToken, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 1,
    tokenName: 'SIX',
    stakingTokenName: QuoteToken.SIX,
    stakingTokenAddress: '0x1FD5a30570b384f03230595E31a4214C9bEdC964',
    contractAddress: {
      97: '0x3AFCcaA6b53295CFdAEe60A63a9D4e173c94be88',
      56: '',
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
