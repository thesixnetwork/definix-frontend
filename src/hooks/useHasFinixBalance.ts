import BigNumber from 'bignumber.js'
import { getFinixAddress } from 'utils/addressHelpers'
import useTokenBalance from './useTokenBalance'

/**
 * A hook to check if a wallet's FINIX balance is at least the amount passed in
 */
const useHasFinixBalance = (minimumBalance: BigNumber) => {
  const finixBalance = useTokenBalance(getFinixAddress())
  return finixBalance.gte(minimumBalance)
}

export default useHasFinixBalance
