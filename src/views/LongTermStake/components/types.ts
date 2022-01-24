export interface IsMobileType {
  isMobile: boolean
}

export interface DataType {
  multiple: number
  day: number
  apr: number
  minStake: number
  level: number
}

export interface AllDataLockType {
  canBeClaim: boolean
  canBeUnlock: boolean
  days: number
  flg: boolean
  id: number
  isPenalty: boolean
  isUnlocked: boolean
  level: number
  lockAmount: number
  lockTimestamp: string
  multiplier: number
  penaltyFinixAmount: number
  penaltyRate: number
  penaltyUnlockTimestamp: string
  periodPenalty: string
  voteAmount: number
  topup: any
  topupTimeStamp: string
  lockTopupTimes: string
}
