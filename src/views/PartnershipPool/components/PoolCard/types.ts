import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'

export interface PoolWithApy extends Pool {
  apy: BigNumber
  rewardPerBlock?: number
  estimatePrice: BigNumber
  pairPrice: BigNumber
}

export interface PoolCardProps {
  pool: PoolWithApy
  isHorizontal?: boolean
}
export interface PoolCardVeloProps {
  pool: PoolWithApy
  isHorizontal?: boolean
  veloAmount?: number
  account?: string
  veloId?: number
}

export interface CardHeadingProps {
  tokenName: string
  isOldSyrup: boolean
  apy: BigNumber
  className?: string
  isHorizontal?: boolean
}

export interface StakeActionProps {
  sousId?: number
  isOldSyrup?: boolean
  tokenName?: string
  stakingTokenAddress?: string
  stakedBalance?: BigNumber
  needsApproval?: boolean
  isFinished?: boolean
  className?: string
  onUnstake?: any
  onPresentDeposit?: any
  onPresentWithdraw?: any
  apolloAddress?: string
}

export interface HarvestActionProps {
  sousId?: number
  isBnbPool?: boolean
  earnings?: BigNumber
  tokenDecimals?: number
  needsApproval?: boolean
  isOldSyrup?: boolean
  className?: string
  veloAmount?: number
  contractAddrss?: string
  pairPrice?: number
  veloId?: number
}

export interface DetailsSectionProps {
  tokenName: string
  totalStaked: BigNumber
  bscScanAddress: string
  isHorizontal?: boolean
  className?: string
}
