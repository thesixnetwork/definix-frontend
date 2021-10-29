import BigNumber from 'bignumber.js'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

export const getFullDisplayBalance = (
  balance: BigNumber,
  options?: {
    decimals?: number
    fixed?: number
  },
) => {
  const decimals = options && typeof options.decimals === 'number' ? options.decimals : 18
  if (balance.eq(new BigNumber(0))) return '0'
  const balanceNumber = balance.dividedBy(new BigNumber(10).pow(decimals));
  if (options && typeof options.fixed === 'number') {
    return balanceNumber.toFixed(options.fixed)
  }
  return balanceNumber.toString()
}
