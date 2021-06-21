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
  bundleRewardLength?: BigNumber
  bundleRewards?: any
  lpTotalSupply?: BigNumber
  apy?: BigNumber
  tokenDecimals?: BigNumber
  quoteTokenDecimals?: BigNumber
  tokenBalanceLP?: BigNumber
  quoteTokenBlanceLP?: BigNumber
  userData?: {
    pendingRewards?: any
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
    pendingRewards?: any
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
  price: number
  sixPrice: number
  klayswapKlayPrice: number
  definixKlayPrice: number
  sixFinixQuote: number
  finixKusdtQuote: number
  finixWklayQuote: number
  finixKspQuote: number
  sixKusdtQuote: number
  sixWklayQuote: number
  klayKethQuote: number
  klayKbtcQuote: number
  klayKxrpQuote: number
  kethKusdtQuote: number
  kbtcKusdtQuote: number
  kxrpKusdtQuote: number
  wklayKusdtQuote: number
  kdaiKusdtQuote: number
  kbnbKusdtQuote: number
  kbnbFinixQuote: number
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
}
