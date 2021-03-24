import { PoolConfig, QuoteToken, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 1,
    tokenName: 'SIX',
    stakingTokenName: QuoteToken.SIX,
    stakingTokenAddress: '0x9bDAF16122eB64E62757BDbBDc4d442495EA6C67',
    contractAddress: {
      97: '0xF360E77668Ad1a2990b13C2d75f1b3D64cFF0692',
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
