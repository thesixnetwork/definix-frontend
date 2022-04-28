import BigNumber from 'bignumber.js'
import { Farm } from 'state/types'
import { provider } from 'web3-core'

export interface LpSymbol {
  image: string
  symbol: string
}

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
  finixApy?: BigNumber
  klayApy?: BigNumber
  favorApy?: BigNumber
  apyValue: number
  totalLiquidityValue: number
  lpSymbols: LpSymbol[]
  isBundle?: boolean
}

export interface FarmCardProps {
  componentType?: string
  farm: FarmWithStakedValue
  myBalancesInWallet?: { [key: string]: BigNumber }
  klaytn?: provider
  account?: string
  reward?: BigNumber
}
