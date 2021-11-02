import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { FarmWithStakedValue } from '../../../Farms/components/FarmCard/types'

export interface PoolWithApy extends Pool {
  apy: BigNumber
  finixApy: BigNumber
  klayApy: BigNumber
  rewardPerBlock?: number
  farm: FarmWithStakedValue
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
  pool?: PoolWithApy
}

export interface DetailsSectionProps {
  isMobile: boolean
  tokenName: string
  totalStaked: BigNumber
  balance: BigNumber
  earnings: BigNumber
  klaytnScopeAddress: string
}
