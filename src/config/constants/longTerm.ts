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

export default longTerm
