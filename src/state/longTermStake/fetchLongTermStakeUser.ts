import longTermConfig from '../../config/constants/longTerm'
import { QuoteToken } from '../../config/constants/types'
import ikip7ABI from '../../config/abi/IKIP7.json'
import rewardABI from '../../config/abi/RewardFacet.json'
import multicall from '../../utils/multicall'
import { getAddress } from '../../utils/addressHelpers'
import { getCaver } from '../../utils/caver'
import BigNumber from 'bignumber.js'

// Pool 0, Finix / Finix is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const longTermStake = longTermConfig.filter((p) => p.lockTokenName === QuoteToken.VFINIX)
// const nonMasterPools = poolsConfig.filter((p) => p.sousId !== 0 && p.sousId !== 1)
const caver = getCaver()
// const herodotusContract = new caver.klay.Contract(herodotusABI as unknown as AbiItem, getHerodotusAddress())

export const fetchLongTermsAllowance = async (account) => {
  const calls = longTermStake.map((p) => ({
    address: p.lockTokenName,
    name: 'allowance',
    params: [account, getAddress(p.tokenAddresses)],
  }))

  const allowances = await multicall(ikip7ABI.abi, calls)
  return longTermStake.reduce(
    (acc, longTerm, index) => ({ ...acc, [longTerm.lsId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // VFINIX
  const calls = longTermStake.map((p) => ({
    address: p.tokenAddresses,
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(ikip7ABI.abi, calls)
  const tokenBalances = longTermStake.reduce(
    (acc, pool, index) => ({ ...acc, [pool.lsId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  return { ...tokenBalances }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = longTermStake.map((p) => ({
    address: getAddress(p.tokenAddresses),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(rewardABI.abi, calls)
  const pendingRewards = longTermStake.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.lsId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  return { ...pendingRewards }
}
