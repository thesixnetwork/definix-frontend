import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'

export interface PoolWithApy extends Pool {
  apy: BigNumber
  rewardPerBlock?: number
  estimatePrice: BigNumber
}

export interface PoolCardProps {
  pool: PoolWithApy
  isHorizontal?: boolean
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
  isBnbPool?: boolean
  isOldSyrup?: boolean
  tokenName?: string
  stakingTokenName?: string
  stakingTokenAddress?: string
  stakingTokenBalance?: BigNumber
  stakedBalance?: BigNumber
  convertedLimit?: BigNumber
  needsApproval?: boolean
  isFinished?: boolean
  stakingLimit?: number
  className?: string
}

export interface HarvestActionProps {
  sousId?: number
  isBnbPool?: boolean
  earnings?: BigNumber
  tokenDecimals?: number
  needsApproval?: boolean
  isOldSyrup?: boolean
  className?: string
}

export interface DetailsSectionProps {
  tokenName: string
  totalStaked: BigNumber
  bscScanAddress: string
  isHorizontal?: boolean
  className?: string
}
