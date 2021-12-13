import longTermConfig from '../../config/constants/longTerm'
import { QuoteToken } from '../../config/constants/types'
import ikip7ABI from '../../config/abi/IKIP7.json'
import rewardABI from '../../config/abi/RewardFacet.json'
import VFinixMergeAbi from '../../config/abi/VFinixMergeAbi.json'
import multicall from '../../utils/multicall'
import { getAddress } from '../../utils/addressHelpers'
import { getCaver } from '../../utils/caver'
import BigNumber from 'bignumber.js'

export const fetchLongTermsAllowance = async (account) => {
  const calls = longTermConfig.map((p) => ({
    address: p.tokenAddresses,
    name: 'allowance',
    params: [account, getAddress(p.tokenAddresses)],
  }))

  const allowances = await multicall(ikip7ABI.abi, calls)
  return longTermConfig.reduce(
    (acc, ls, index) => ({ ...acc, [ls.allowances]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  const calls = longTermConfig.map((p) => ({
    address: p.tokenAddresses,
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(ikip7ABI.abi, calls)
  const tokenBalances = longTermConfig.reduce(
    (acc, ls, index) => ({ ...acc, [ls.balanceOf]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  return { ...tokenBalances }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = longTermConfig.map((p) => ({
    address: getAddress(p.tokenAddresses),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(rewardABI.abi, calls)
  const pendingRewards = longTermConfig.reduce(
    (acc, ls, index) => ({
      ...acc,
      [ls.pendingRewards]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  return { ...pendingRewards }
}
