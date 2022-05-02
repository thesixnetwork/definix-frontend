import addresses from 'config/constants/contracts'

export const getAddress = (address: any): string => {
  const mainNetChainId = 8217
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getBscFinixAddress = () => {
  return getAddress(addresses.bscFinix)
}
export const getBscCollecteralAddress = () => {
  return getAddress(addresses.bscCollecteral)
}
export const getFinixAddress = () => {
  return getAddress(addresses.finix)
}
export const getDefinixHerodotusAddress = () => {
  return getAddress(addresses.definixHerodotus)
}
export const getHerodotusAddress = () => {
  return getAddress(addresses.herodotus)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.mulltiCall)
}
export const getWklayAddress = () => {
  return getAddress(addresses.wklay)
}
export const getKspAddress = () => {
  return getAddress(addresses.ksp)
}
export const getSixAddress = () => {
  return getAddress(addresses.six)
}
export const getKdaiAddress = () => {
  return getAddress(addresses.kdai)
}
export const getKusdtAddress = () => {
  return getAddress(addresses.ousdt)
}
export const getKethAddress = () => {
  return getAddress(addresses.keth)
}
export const getKbtcAddress = () => {
  return getAddress(addresses.kwbtc)
}
export const getOxrpAddress = () => {
  return getAddress(addresses.oxrp)
}
export const getKbnbAddress = () => {
  return getAddress(addresses.kbnb)
}
export const getFinixSixLPAddress = () => {
  return getAddress(addresses.finixSixLP)
}
export const getFinixKusdtLPAddress = () => {
  return getAddress(addresses.finixKusdtLP)
}
export const getFinixKlayLPAddress = () => {
  return getAddress(addresses.finixKlayLP)
}
export const getFinixKspLPAddress = () => {
  return getAddress(addresses.finixKspLP)
}
export const getSixKusdtLPAddress = () => {
  return getAddress(addresses.sixKusdtLP)
}
export const getSixKlayLPAddress = () => {
  return getAddress(addresses.sixKlayLP)
}
export const getKlayKethLPAddress = () => {
  return getAddress(addresses.klayKethLP)
}
export const getKlayKbtcLPAddress = () => {
  return getAddress(addresses.klayKbtcLP)
}
export const getKlayOxrpLPAddress = () => {
  return getAddress(addresses.klayOxrpLP)
}
export const getKethKusdtLPAddress = () => {
  return getAddress(addresses.kethKusdtLP)
}
export const getKbtcKusdtLPAddress = () => {
  return getAddress(addresses.kbtcKusdtLP)
}
export const getOxrpKusdtLPAddress = () => {
  return getAddress(addresses.oxrpKusdtLP)
}
export const getKlayKusdtLPAddress = () => {
  return getAddress(addresses.klayKusdtLP)
}
export const getKdaiKusdtLPAddress = () => {
  return getAddress(addresses.kdaiKusdtLP)
}
export const getKbnbKusdtLPAddress = () => {
  return getAddress(addresses.kbnbKusdtLP)
}
export const getKbnbFinixLPAddress = () => {
  return getAddress(addresses.kbnbFinixLP)
}
export const getDefinixKlayKusdtLPAddress = () => {
  return getAddress(addresses.definixKlayKusdtLP)
}
export const getTradingCompetRegisAddress = () => {
  return getAddress(addresses.tradingCompetRegis)
}
export const getDeParamAddress = () => {
  return getAddress(addresses.deParam)
}
export const getVFinix = () => {
  return getAddress(addresses.vFinix)
}
export const getVFinixVoting = () => {
  return getAddress(addresses.vFinixVoting)
}
