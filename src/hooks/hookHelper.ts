import herodotus from 'config/abi/herodotus.json'
import erc20 from 'config/abi/erc20.json'
import rebalance from 'config/abi/rebalance.json'
import VaultFacet from 'config/abi/VaultFacet.json'
import RewardFacet from 'config/abi/RewardFacet.json'
import VaultPenaltyFacet from 'config/abi/VaultPenaltyFacet.json'

export const getAbiHerodotusByName = (methodName: string) =>
  herodotus.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiERC20ByName = (methodName: string) =>
  erc20.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiRebalanceByName = (methodName: string) =>
  rebalance.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiVaultFacetByName = (methodName: string) =>
  VaultFacet.abi.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiRewardFacetByName = (methodName: string) =>
  RewardFacet.abi.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiVaultPenaltyFacetByName = (methodName: string) =>
  VaultPenaltyFacet.abi.find((abi) => abi.type === 'function' && abi.name === methodName)