import { LongTermStakeConfig } from './types'

const longTerm: LongTermStakeConfig[] = [
  {
    lpSymbol: 'vFINIX',
    tokenSymbol: 'vFINIX',
    tokenAddresses:
      process.env.REACT_APP_CHAIN_ID === '1001'
        ? process.env.REACT_APP_VFINIX_ADDRESS_TESTNET
        : process.env.REACT_APP_VFINIX_ADDRESS_MAINNET,
  },
]

export const longTermDays = [{
  multiplier: 1,
  days: 90,
}, {
  multiplier: 2,
  days: 180,
}, {
  multiplier: 4,
  days: 365,
}]

export default longTerm
