import { Toast } from 'uikit-dev'
import BigNumber from 'bignumber.js'
import { CampaignType, FarmConfig, Nft, PoolConfig, Team } from 'config/constants/types'

export type TranslatableText =
  | string
  | {
      id: number
      fallback: string
      data?: {
        [key: string]: string | number
      }
    }

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  lpTokenRatio?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  finixPerBlock?: BigNumber
  BONUS_MULTIPLIER?: BigNumber
  tokenBalanceLP?: BigNumber
  quoteTokenBlanceLP?: BigNumber
  tokenDecimals?: BigNumber
  quoteTokenDecimals?: BigNumber
  lpTotalSupply?: BigNumber
  apy?: BigNumber
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  rewardPerBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface Profile {
  userId: number
  points: number
  teamId: number
  nftAddress: string
  tokenId: number
  isActive: boolean
  username: string
  nft?: Nft
  team: Team
  hasRegistered: boolean
}

// Slices states

export interface ToastsState {
  data: Toast[]
}

export interface FarmsState {
  isFetched: boolean
  data: Farm[]
  farmUnlockAt?: Date
}

export interface PoolsState {
  isFetched: boolean
  data: Pool[]
}

export interface FinixPriceState {
  caverTVL: number
  web3TVL: number
  price: number
  sixPrice: number
  pancakeBnbPrice: number
  sixFinixQuote: number
  sixBusdQuote: number
  sixUsdtQuote: number
  sixWbnbQuote: number
  finixBusdQuote: number
  finixUsdtQuote: number
  finixWbnbQuote: number
  wbnbBusdQuote: number
  wbnbUsdtQuote: number
  busdUsdtQuote: number
  bnbBtcbQuote: number
  ethBnbQuote: number
  veloBusdPrice: number
}

export interface NFTData {
  code: string
  order: number
  name: string
  title: string
  grade: string
  detailTitleKey: string
  detailDescKey: string
  price: number
  availableAmount?: number
  totalAmount: number
  limitCount: number
  videoUrl: string
  previewVideoUrl: string
  previewImgId: string
  imageUrl: string
  startID: number
  endID: number
  userData?: {
    amountOwn: number
    owning: number[]
  }
  metaDataURL: string
}

export interface ProfileState {
  isInitialized: boolean
  isLoading: boolean
  hasRegistered: boolean
  data: Profile
}

export type TeamResponse = {
  0: string
  1: string
  2: string
  3: string
  4: boolean
}

export type TeamsById = {
  [key: string]: Team
}

export interface TeamsState {
  isInitialized: boolean
  isLoading: boolean
  data: TeamsById
}

export interface Achievement {
  id: string
  type: CampaignType
  address: string
  title: TranslatableText
  description?: TranslatableText
  badge: string
  points: number
}

export interface AchievementState {
  data: Achievement[]
}

// Global state

export interface State {
  finixPrice: FinixPriceState
  farms: FarmsState
  toasts: ToastsState
  pools: PoolsState
  profile: ProfileState
  teams: TeamsState
  achievements: AchievementState
  nft: NFTData
}
