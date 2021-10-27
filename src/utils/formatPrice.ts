import BigNumber from 'bignumber.js'

export const convertToUsd = (value: number | BigNumber, fixed?: number) => {
  if (!value) {
    return '$0'
  }
  return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: fixed || 0 })}`
}

export default {
  convertToUsd,
}
