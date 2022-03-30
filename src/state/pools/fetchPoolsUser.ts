import { AbiItem } from 'web3-utils'
import poolsConfig from 'config/constants/pools'
import herodotusABI from 'config/abi/herodotus.json'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import { QuoteToken } from 'config/constants/types'
import multicall from 'utils/multicall'
import { getAddress, getHerodotusAddress } from 'utils/addressHelpers'
import { getCaverKlay } from 'utils/caver'
import BigNumber from 'bignumber.js'

// Pool 0, Finix / Finix is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((p) => p.stakingTokenName !== QuoteToken.KLAY)
const bnbPools = poolsConfig.filter((p) => p.stakingTokenName === QuoteToken.KLAY)
const nonMasterPools = poolsConfig.filter((p) => p.sousId !== 0 && p.sousId !== 1)
const { Contract, getBalance } = getCaverKlay()
const herodotusContract = new Contract(herodotusABI as unknown as AbiItem, getHerodotusAddress())

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((p) => ({
    address: p.stakingTokenAddress,
    name: 'allowance',
    params: [account, getAddress(p.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const calls = nonBnbPools.map((p) => ({
    address: p.stakingTokenAddress,
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls)
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  // BNB pools
  const bnbBalance = await getBalance(account)
  const bnbBalances = bnbPools.reduce(
    (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance).toJSON() }),
    {},
  )

  return { ...tokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(sousChefABI, calls)
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  // Finix / Finix pool
  const { amount: masterPoolAmount } = await herodotusContract.methods.userInfo('0', account).call()

  // SIX / Finix pool
  const { amount: sixPoolAmount } = await herodotusContract.methods.userInfo('1', account).call()

  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount).toJSON(), 1: new BigNumber(sixPoolAmount).toJSON() }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(sousChefABI, calls)
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  // Finix / Finix pool
  const pendingReward = await herodotusContract.methods.pendingFinix('0', account).call()

  // SIX / Finix pool
  const sixPendingReward = await herodotusContract.methods.pendingFinix('1', account).call()

  return { ...pendingRewards, 0: new BigNumber(pendingReward).toJSON(), 1: new BigNumber(sixPendingReward).toJSON() }
}
