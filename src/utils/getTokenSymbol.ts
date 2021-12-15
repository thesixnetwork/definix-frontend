import { allTokens } from '../config/constants/tokens'

const getAddresses = () => {
  return Object.entries(allTokens).reduce((result, token) => {
    const obj = {}
    const [tokenSymbol, tokenAddressSet] = token
    Object.values(tokenAddressSet).forEach((address) => {
      obj[address] = tokenSymbol
    })
    return { ...result, ...obj }
  }, {})
}
const addresses = getAddresses()

export const tokenAddressMap = addresses
export const getTokenSymbol = (tokenAddress) => {
  try {
    if (tokenAddress === 'main') return 'KLAY'
    const symbol = addresses[tokenAddress]
    return symbol === 'WKLAY' ? 'KLAY' : symbol
  } catch (error) {
    return '-'
  }
}

export const getTokenName = (symbol: string) => {
  if (symbol === 'WKLAY') return 'KLAY'
  if (symbol === 'WBNB') return 'BNB'
  return symbol
}
