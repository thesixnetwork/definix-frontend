import BigNumber from 'bignumber.js'
import { Farm } from 'state/types'
import { provider } from 'web3-core'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
  finixApy?: BigNumber
  klayApy?: BigNumber
}

export interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  bnbPrice?: BigNumber
  ethPrice?: BigNumber
  sixPrice?: BigNumber
  finixPrice?: BigNumber
  ethereum?: provider
  account?: string
  isHorizontal?: boolean
}
