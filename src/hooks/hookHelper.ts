import herodotus from 'config/abi/herodotus.json'
import erc20 from 'config/abi/erc20.json'
import rebalance from 'config/abi/rebalance.json'

// swap-interface
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'

export const getAbiHerodotusByName = (methodName: string) =>
  herodotus.find((abi) => abi.type === 'function' && abi.name === methodName)
export const getAbiERC20ByName = (methodName: string) =>
  erc20.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiRebalanceByName = (methodName: string) =>
  rebalance.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getApproveAbi = () => erc20.find(abi => abi.type === 'function' && abi.name === 'approve')
export const getAbiByName = (methodName) => IUniswapV2Router02ABI.find(abi => abi.type === 'function' && abi.name === methodName)

