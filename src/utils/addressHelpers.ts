import addresses from 'config/constants/contracts'

export const getAddress = (address: any): string => {
  const mainNetChainId = 56
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
export const getWbnbAddress = () => {
  return getAddress(addresses.wbnb)
}
export const getSixAddress = () => {
  return getAddress(addresses.six)
}
export const getBusdAddress = () => {
  return getAddress(addresses.busd)
}
export const getUsdtAddress = () => {
  return getAddress(addresses.usdt)
}
export const getBtcbAddress = () => {
  return getAddress(addresses.btcb)
}
export const getEthAddress = () => {
  return getAddress(addresses.eth)
}
export const getXrpAddress = () => {
  return getAddress(addresses.xrp)
}
export const getAdaAddress = () => {
  return getAddress(addresses.ada)
}
export const getFinixSixLPAddress = () => {
  return getAddress(addresses.finixSixLP)
}
export const getFinixBusdLPAddress = () => {
  return getAddress(addresses.finixBusdLP)
}
export const getFinixBnbLPAddress = () => {
  return getAddress(addresses.finixBnbLP)
}
export const getSixBusdLPAddress = () => {
  return getAddress(addresses.sixBusdLP)
}
export const getDefinixBnbBusdLPAddress = () => {
  return getAddress(addresses.pancakeBnbBusdLP)
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
export const getAirdropKlayAddress = () => {
  return getAddress(addresses.airdropKlay)
}
