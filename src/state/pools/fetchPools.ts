import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import finixABI from 'config/abi/finix.json'
import wklayABI from 'config/abi/wklay.json'
import { QuoteToken } from 'config/constants/types'
import multicall from 'utils/multicall'
import { getAddress, getWklayAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0 && p.sousId !== 1)
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    }
  })
  const callsRewardPerBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'rewardPerBlock',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)
  const rewards = await multicall(sousChefABI, callsRewardPerBlock)

  return poolsWithEnd.map((finixPoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    const rewardPerBlock = rewards[index]
    return {
      sousId: finixPoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
      rewardPerBlock: new BigNumber(rewardPerBlock).toJSON(),
    }
  })
}

export const fetchPoolsTotalStatking = async () => {
  const nonKlayPools = poolsConfig.filter((p) => p.stakingTokenName !== QuoteToken.KLAY)
  const klayPool = poolsConfig.filter((p) => p.stakingTokenName === QuoteToken.KLAY)

  const callsNonKlayPools = nonKlayPools.map((poolConfig) => {
    return {
      address: poolConfig.stakingTokenAddress,
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const callsKlayPools = klayPool.map((poolConfig) => {
    return {
      address: getWklayAddress(),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const nonKlayPoolsTotalStaked = await multicall(finixABI, callsNonKlayPools)
  const klayPoolsTotalStaked = await multicall(wklayABI, callsKlayPools)

  return [
    ...nonKlayPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonKlayPoolsTotalStaked[index]).toJSON(),
    })),
    ...klayPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(klayPoolsTotalStaked[index]).toJSON(),
    })),
  ]
}
