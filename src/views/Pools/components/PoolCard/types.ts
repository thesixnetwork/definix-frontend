import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'

export interface PoolWithApy extends Pool {
  apy: BigNumber
  rewardPerBlock?: number
  estimatePrice: BigNumber
}

export interface PoolCardProps {
  componentType?: string
  pool: PoolWithApy
  isHorizontal?: boolean
  myBalanceInWallet?: BigNumber
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
