import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { FarmWithStakedValue } from '../../../Farms/components/FarmCard/types'

export interface PoolWithApy extends Pool {
  apy: BigNumber
  finixApy?: BigNumber
  klayApy?: BigNumber
  rewardPerBlock?: number
  farm: FarmWithStakedValue
}

export interface PoolCardProps {
  componentType?: string
  pool: PoolWithApy
  myBalanceInWallet?: BigNumber
}

export interface CardHeadingProps {
  isOldSyrup: boolean
  pool: PoolWithApy
  size?: string
}

export interface StakeActionProps {
  componentType?: string
  isOldSyrup: boolean
  pool: PoolWithApy
  stakedBalance: BigNumber
  needsApprovalContract: boolean
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
