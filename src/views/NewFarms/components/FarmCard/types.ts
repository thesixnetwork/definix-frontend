import BigNumber from 'bignumber.js'
import { Farm } from 'state/types'
import { provider } from 'web3-core'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
  finixApy?: BigNumber
  klayApy?: BigNumber
  apyValue: number
  totalLiquidityValue: number
}

export interface FarmCardProps {
  importFrom?: string
  farm: FarmWithStakedValue
  myBalancesInWallet?: { [key: string]: BigNumber }
  removed: boolean
  klaytn?: provider
  account?: string
  onSelectAddLP?: (props: any) => void
  onSelectRemoveLP?: (props: any) => void
}
