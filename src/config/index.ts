import BigNumber from 'bignumber.js/bignumber'

export const ChainId = {
  MAINNET: parseInt(process.env.REACT_APP_MAINNET_ID || '0') || 0,
  TESTNET: parseInt(process.env.REACT_APP_TESTNET_ID || '0') || 0,
}

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const IS_GENESIS = false
export const FINIX_PER_BLOCK = new BigNumber(1.08)
export const KLAY_PER_BLOCK = new BigNumber(0.1)
export const BLOCKS_PER_YEAR = new BigNumber(31536000)
export const BSC_BLOCK_TIME = 3
export const FINIX_POOL_PID = 7
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1
