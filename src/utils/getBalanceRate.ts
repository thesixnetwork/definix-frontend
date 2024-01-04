export const getBalanceRate = (balance: number, rate: number) => {
  const value = rate === 1 ? balance : balance * rate
  return String(Math.floor(value * 1000000) / 1000000)
}
