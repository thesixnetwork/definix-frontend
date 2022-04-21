import BigNumber from 'bignumber.js'
import { Farm } from 'state/types'
import { provider } from 'web3-core'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
  finixApy?: BigNumber
  klayApy?: BigNumber
  favorApy?: BigNumber
}

export interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  favorPrice?: BigNumber
  klayPrice?: BigNumber
  kethPrice?: BigNumber
  sixPrice?: BigNumber
  finixPrice?: BigNumber
  klaytn?: provider
  account?: string
  isHorizontal?: boolean
  inlineMultiplier?: boolean
}
