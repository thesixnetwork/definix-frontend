import { Toast } from 'uikit-dev'
import BigNumber from 'bignumber.js'
import {
  CampaignType,
  FarmConfig,
  LongTermStakeConfig,
  RebalanceConfig,
  Nft,
  PoolConfig,
  Team,
} from 'config/constants/types'

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

export interface LongTermStake extends LongTermStakeConfig {
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
  tokenBalanceLP?: BigNumber
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

export interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
  totalBalance: BigNumber
}
export interface Rebalance extends RebalanceConfig {
  currentPoolUsdBalances?: BigNumber[]
  sumCurrentPoolUsdBalance?: BigNumber
  totalSupply?: BigNumber
  activeUserCount?: BigNumber
  tokens?: Token[]
  usdToken?: Token[]
  usdTokenRatioPoint?: BigNumber
  totalRatioPoints?: BigNumber[]
  finixRewardPerYear?: BigNumber
  activeUserCountNumber?: number
  totalAssetValue?: BigNumber
  sharedPrice?: BigNumber
  last24Data?: any
  // sharpeRatio?: number
  // maxDrawdown?: number
  // tokenUsd?: BigNumber[]
  enableAutoCompound?: boolean
  autoHerodotus?: string
  sharedPricePercentDiff?: number
  twentyHperformance?: number
  ratioCal?: string[]
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

export interface LongTermState {
  data: LongTermStake[]
  isFetched: boolean
  id: string
  level: string
  amount: number
  isPenalty: Boolean
  periodPenalty: string
  penaltyUnlockTimestamp: string
  penaltyFinixAmount: string
  voteAmount: BigNumber
  canBeUnlock: boolean
  penaltyRate: number
  totalFinixLock: number
  totalvFinixSupply: number
  finixLockMap: []
  userLockAmount: number
  finixEarn: number
  allLockPeriods: []
  totalSupplyAllTimeMint: number
  startIndex: number
  allDataLock: []
  multiplier: number
  days: number
  vFinixPrice: number
  lockCount: number
  balanceFinix: number
  balancevFinix: number
}
export interface PoolsState {
  isFetched: boolean
  data: Pool[]
}

export interface RebalanceState {
  isFetched: boolean
  data: Rebalance[]
}

export interface Balances {
  [key: string]: BigNumber
}

export interface Balance {
  [key: string]: Balances
}

export interface Allowance {
  [key: string]: Balance
}

export interface WalletState {
  decimals: Balance
  balances: Balance
  userRebalanceBalances: Balance
  userDeadline?: number
  allowances: Allowance
  userSlippage?: number
  isFetched: boolean
  isRebalanceFetched: boolean
}

export interface FinixPriceState {
  caverTVL: number
  web3TVL: number
  price: number
  sixPrice: number
  klayswapKlayPrice: number
  definixKlayPrice: number
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
  rebalances: RebalanceState
  wallet: WalletState
  longTerm: LongTermState
}
