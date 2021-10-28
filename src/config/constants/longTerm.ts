import contracts from './contracts'
import { LongTermStakeConfig, QuoteToken } from './types'

const longTerm: LongTermStakeConfig[] = [
  {
    lsId: 0,
    lpSymbol: 'vFINIX',
    tokenSymbol: 'vFINIX',
    tokenAddresses:
      process.env.REACT_APP_CHAIN_ID === '1001'
        ? process.env.REACT_APP_VFINIX_ADDRESS_TESTNET
        : process.env.REACT_APP_VFINIX_ADDRESS_MAINNET,
    lockTokenSymbol: QuoteToken.VFINIX,
    lockTokenName: QuoteToken.VFINIX,
  },
]

export default longTerm
