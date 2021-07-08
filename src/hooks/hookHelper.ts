import herodotus from 'config/abi/herodotus.json'
import erc20 from 'config/abi/erc20.json'

export const getAbiHerodotusByName = (methodName) => herodotus.find(abi => abi.type === 'function' && abi.name === methodName)
export const getAbiERC20ByName = (methodName) => erc20.find(abi => abi.type === 'function' && abi.name === methodName)