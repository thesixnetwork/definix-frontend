export const getTokenImageUrl = (tokenName: string) => {
  return `/images/coins/${tokenName.toLowerCase()}.png`
}

const getSplittedLpSymbols = (lpSymbol: string) => {
  const symbol = lpSymbol
    .toUpperCase()
    .replace(/(DEFINIX)|(LP)/g, '')
    .trim()
  return symbol.split('-')
}

export const getLpImageUrls = (lpSymbol: string) => {
  const images = getSplittedLpSymbols(lpSymbol)
  return images.map((image) => `/images/coins/${image}.png`)
}

export const getLpImageUrlsAndSymbols = (lpSymbol: string) => {
  const symbols = getSplittedLpSymbols(lpSymbol)
  return symbols.map((symbol) => {
    return {
      symbol,
      image: getTokenImageUrl(symbol),
    }
  })
}
