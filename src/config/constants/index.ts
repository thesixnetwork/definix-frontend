import farmsConfig from './farms'

const communityFarms = farmsConfig.filter((farm) => farm.isCommunity).map((farm) => farm.tokenSymbol)

export const managementFee = 0.2
export const buyBackFee = 0.3
export const ecosystemFee = 0.3
export { farmsConfig, communityFarms }
export { default as poolsConfig } from './pools'
export { default as ifosConfig } from './ifo'
