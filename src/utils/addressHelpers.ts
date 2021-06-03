import addresses from 'config/constants/contracts'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 8217
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[mainNetChainId]
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
  return getAddress(addresses.kusdt)
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
export const getDefinixKlayKusdtLPAddress = () => {
  return getAddress(addresses.definixKlayKusdtLP)
}
export const getTradingCompetRegisAddress = () => {
  return getAddress(addresses.tradingCompetRegis)
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
