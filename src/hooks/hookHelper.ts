import herodotus from 'config/abi/herodotus.json'
import erc20 from 'config/abi/erc20.json'
import rebalance from 'config/abi/rebalance.json'
import VaultFacet from 'config/abi/VaultFacet.json'
import RewardFacet from 'config/abi/RewardFacet.json'
import VaultPenaltyFacet from 'config/abi/VaultPenaltyFacet.json'
import VaultTopUpFeatureFacet from 'config/abi/VaultTopUpFeatureFacet.json'
import IProposalFacet from 'config/abi/IProposalFacet.json'
import IUsageFacet from 'config/abi/IUsageFacet.json'
import IVotingFacet from 'config/abi/IVotingFacet.json'
import WETH_ABI from 'config/abi/weth.json'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'

export const getAbiByNameWETH = (methodName) =>
  WETH_ABI.find((abi) => abi.type === 'function' && abi.name === methodName)
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

export const VaultTopUpFeatureFacetByName = (methodName: string) =>
  VaultTopUpFeatureFacet.abi.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiIProposalFacetByName = (methodName: string) =>
  IProposalFacet.abi.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiIUsageFacetByName = (methodName: string) =>
  IUsageFacet.abi.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getAbiIVotingFacetByName = (methodName: string) =>
  IVotingFacet.abi.find((abi) => abi.type === 'function' && abi.name === methodName)

export const getApproveAbi = () => erc20.find((abi) => abi.type === 'function' && abi.name === 'approve')
export const getAbiByName = (methodName) =>
  IUniswapV2Router02ABI.find((abi) => abi.type === 'function' && abi.name === methodName)
