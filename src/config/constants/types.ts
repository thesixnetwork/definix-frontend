export enum QuoteToken {
  'KLAY' = 'KLAY',
  'WKLAY' = 'WKLAY',
  'SYRUP' = 'SYRUP',
  'OUSDT' = 'oUSDT',
  'KDAI' = 'KDAI',
  'OETH' = 'oETH',
  'OXRP' = 'oXRP',
  'OWBTC' = 'oWBTC',
  'OBNB' = 'oBNB',
  'SIX' = 'SIX',
  'FINIX' = 'FINIX',
  'VFINIX' = 'VFINIX',
  'SIXFINIX' = 'FINIX-SIX',
  'FINIXOUSDT' = 'FINIX-oUSDT',
  'FINIXKLAY' = 'FINIX-KLAY',
  'SIXOUSDT' = 'SIX-oUSDT',
  'KDAIOUSDT' = 'KDAI-oUSDT',
  'KSP' = 'KSP',
  /**
   * @favor
   */
  'FAVOR' = 'Favor'
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  // 'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token,
  'KLAYTN' = 'Klaytn',
}

export interface Address {
  1001?: string
  8217?: string
}

export interface Ratio {
  symbol: string
  value: number
  color?: string
  address: any
}

export interface Fee {
  management: number
  bounty: number
  buyback: number
}
export interface RebalanceConfig {
  title: string
  description: string
  fullDescription: string
  icon: string[]
  address: any
  ratio: Ratio[]
  last24data?: any
  factsheet: any
  fee: Fee
  rebalace: string
}

export interface FarmConfig {
  pid: number
  lpSymbol: string
  lpAddresses: Address | any
  tokenSymbol: string
  tokenAddresses: Address | any
  quoteTokenSymbol: QuoteToken
  quoteTokenAdresses: Address | any
  multiplier?: string
  isCommunity?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
  firstToken?: any
  secondToken?: any
  tag?: string
  firstSymbol?: string
  secondSymbol?: string
  isFinished?: boolean;
}

export interface LongTermStakeConfig {
  lpSymbol: string
  tokenSymbol: string
  tokenAddresses: any
  lockTokenSymbol?: QuoteToken
  multiplier?: string
  isCommunity?: boolean
  pendingRewards?: number
  balanceOf?: number
  allowances?: number
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface PoolConfig {
  sousId: number
  image?: string
  tokenName: string
  stakingTokenName: QuoteToken
  stakingLimit?: number
  stakingTokenAddress?: string
  contractAddress: any
  poolCategory: PoolCategory
  projectLink: string
  tokenPerBlock: string
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  tokenDecimals: number
}

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type ConnectorId = 'injected' | 'klip'
