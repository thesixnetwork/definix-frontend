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
export const getOusdtAddress = () => {
  return getAddress(addresses.ousdt)
}
export const getOethAddress = () => {
  return getAddress(addresses.oeth)
}
export const getOwbtcAddress = () => {
  return getAddress(addresses.owbtc)
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
export const getFinixOusdtLPAddress = () => {
  return getAddress(addresses.finixOusdtLP)
}
export const getFinixKlayLPAddress = () => {
  return getAddress(addresses.finixKlayLP)
}
export const getFinixKspLPAddress = () => {
  return getAddress(addresses.finixKspLP)
}
export const getSixOusdtLPAddress = () => {
  return getAddress(addresses.sixOusdtLP)
}
export const getSixKlayLPAddress = () => {
  return getAddress(addresses.sixKlayLP)
}
export const getKlayOethLPAddress = () => {
  return getAddress(addresses.klayOethLP)
}
export const getKlayOwbtcLPAddress = () => {
  return getAddress(addresses.klayOwbtcLP)
}
export const getKlayOxrpLPAddress = () => {
  return getAddress(addresses.klayOxrpLP)
}
export const getOethOusdtLPAddress = () => {
  return getAddress(addresses.oethOusdtLP)
}
export const getOwbtcOusdtLPAddress = () => {
  return getAddress(addresses.owbtcOusdtLP)
}
export const getOxrpOusdtLPAddress = () => {
  return getAddress(addresses.oxrpOusdtLP)
}
export const getKlayOusdtLPAddress = () => {
  return getAddress(addresses.klayOusdtLP)
}
export const getKdaiOusdtLPAddress = () => {
  return getAddress(addresses.kdaiOusdtLP)
}
export const getKbnbOusdtLPAddress = () => {
  return getAddress(addresses.kbnbOusdtLP)
}
export const getKbnbFinixLPAddress = () => {
  return getAddress(addresses.kbnbFinixLP)
}
export const getDefinixKlayOusdtLPAddress = () => {
  return getAddress(addresses.definixKlayOusdtLP)
}
export const getTradingCompetRegisAddress = () => {
  return getAddress(addresses.tradingCompetRegis)
}
export const getDeParamAddress = () => {
  return getAddress(addresses.deParam)
}
export const getLotteryAddress = () => {
  return getAddress(addresses.lottery)
}
export const getLotteryTicketAddress = () => {
  return getAddress(addresses.lotteryNFT)
}
export const getDefinixProfileAddress = () => {
  return getAddress(addresses.definixProfile)
}
export const getDefinixRabbitsAddress = () => {
  return getAddress(addresses.definixRabbits)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getVFinix = () => {
  return getAddress(addresses.vFinix)
}
export const getVFinixVoting = () => {
  return getAddress(addresses.vFinixVoting)
}
