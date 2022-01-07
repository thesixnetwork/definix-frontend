import numeral from 'numeral'

const getBalanceOverBillion = (value: number) => {
  if (value >= 1000000000) {
    return numeral(value).format('0,0')
  }
  return numeral(Math.floor(value * 100) / 100).format('0,0.[00]')
}

export default getBalanceOverBillion
