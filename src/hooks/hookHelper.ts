import herodotus from 'config/abi/herodotus.json'
import erc20 from 'config/abi/erc20.json'
import rebalance from 'config/abi/rebalance.json'

export const getAbiHerodotusByName = (methodName:string) =>
  herodotus.find((abi) => abi.type === 'function' && abi.name === methodName)
export const getAbiERC20ByName = (methodName:string) => erc20.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiRebalanceByName = (methodName:string) =>
rebalance.find((abi) => abi.type === 'function' && abi.name === methodName)