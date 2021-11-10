export const getTokenImageUrl = (tokenName: string) => {
  return `/images/coins/${tokenName.toLowerCase()}.png`
}

export const getLpImageUrls = (lpSymbol: string) => {
  const symbol = lpSymbol
    .toUpperCase()
    .replace(/(DEFINIX)|(LP)/g, '')
    .trim()
  const images = symbol.split('-')
  return images.map((image) => `/images/coins/${image}.png`)
}
