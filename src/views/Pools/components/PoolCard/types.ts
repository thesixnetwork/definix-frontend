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
  onSelectAdd?: (props: any) => void
  onSelectRemove?: (props: any) => void
}

export interface CardHeadingProps {
  tokenName: string
  isOldSyrup: boolean
  apy: BigNumber
  size?: string
}

export interface StakeActionProps {
  componentType?: string
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
