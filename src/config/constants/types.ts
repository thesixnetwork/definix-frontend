import { TranslatableText } from 'state/types'

export type IfoStatus = 'coming_soon' | 'live' | 'finished'

export interface Ifo {
  id: string
  isActive: boolean
  address: string
  name: string
  subTitle?: string
  description?: string
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  finixToBurn: string
  projectSiteUrl: string
  currency: string
  currencyAddress: string
  tokenDecimals: number
  releaseBlockNumber: number
  campaignId?: string
}

export enum QuoteToken {
  'BNB' = 'BNB',
  'SYRUP' = 'SYRUP',
  'BUSD' = 'BUSD',
  'TWT' = 'TWT',
  'UST' = 'UST',
  'ETH' = 'ETH',
  'COMP' = 'COMP',
  'SUSHI' = 'SUSHI',
  'SIX' = 'SIX',
  'VELO' = 'VELO',
  'FINIX' = 'FINIX',
  'SIXFINIX' = 'FINIX-SIX',
  'FINIXBUSD' = 'FINIX-BUSD',
  'FINIXBNB' = 'FINIX-BNB',
  'SIXBUSD' = 'SIX-BUSD',
  'USDTBUSD' = 'USDT-BUSD',
}

export enum PoolCategory {
  'PARTHNER' = 'parthner',
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
}

export interface Address {
  97?: string
  56: string
}

export interface Ratio {
  symbol: string
  value: number
  color?: string
  address: any
}

export interface Fee {
  management: number
  // bounty: number
  buyback: number
}
export interface RebalanceConfig {
  title: string
  description: string
  fullDescription: string
  icon: string[]
  address: any
  router: any
  factory: any
  initCodeHash: any
  ratio: Ratio[]
  last24data?: any
  factsheet: any
  fee: Fee
  badge: string
  type: string
}

export interface FarmConfig {
  pid: number
  lpSymbol: string
  lpAddresses: any
  tokenSymbol: string
  tokenAddresses: any
  quoteTokenSymbol: QuoteToken
  quoteTokenAdresses: any
  multiplier?: string
  isCommunity?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
  tag?: string
  firstToken?: any
  secondToken?: any
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

export type NftImages = {
  blur?: string
} & Images

export type NftVideo = {
  webm: string
  mp4: string
}

export type Nft = {
  name: string
  description: string
  images: NftImages
  sortOrder: number
  bunnyId: number
  video?: NftVideo
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'ifo'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}
