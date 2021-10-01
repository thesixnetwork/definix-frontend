import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import herodotusABI from 'config/abi/herodotus.json'
import multicall from 'utils/multicall'
import { getContract } from 'utils/caver'
import farmsConfig from 'config/constants/farms'
import { getAddress, getHerodotusAddress } from 'utils/addressHelpers'

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < (array.length || array.size); index++) {
    // eslint-disable-next-line
    await callback(array[index] || array.docs[index], index, array)
  }
}

export const fetchFarmUserAllowances = async (account: string) => {
  const herodotusAdress = getHerodotusAddress()

  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, herodotusAdress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string) => {
  const herodotusAdress = getHerodotusAddress()

  const calls = farmsConfig.map((farm) => {
    return {
      address: herodotusAdress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(herodotusABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string) => {
  const herodotusAdress = getHerodotusAddress()

  const calls = farmsConfig.map((farm) => {
    return {
      address: herodotusAdress,
      name: 'pendingFinix',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(herodotusABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchFarmPendingRewards = async (account: string) => {
  const herodotusAdress = getHerodotusAddress()

  const allBundleRewards = []
  await asyncForEach(farmsConfig, async (farm) => {
    const [bundleRewardLength] = await multicall(herodotusABI, [
      {
        address: herodotusAdress,
        name: 'bundleRewardLength',
        params: [farm.pid],
      },
    ])
    const numberBundleRewardLength = new BigNumber(bundleRewardLength).toNumber()
    if (numberBundleRewardLength > 0) {
      // const allBundleRequests = []

      /* eslint-disable no-await-in-loop */
      const apbrArr = []
      for (let i = 0; i < numberBundleRewardLength; i++) {
        // allBundleRequests.push({
        //   address: herodotusAdress,
        //   name: 'pendingBundleReward',
        //   params: [farm.pid, i, account],
        // })
        const herodotusAdressContract = getContract(herodotusABI, herodotusAdress)
        const apbr = await herodotusAdressContract.methods
          .pendingBundleReward(farm.pid, i, account)
          .call({ from: account })
        apbrArr.push({ reward: new BigNumber(apbr), bundleId: i })
      }
      allBundleRewards.push(apbrArr)
      /* eslint-enable no-await-in-loop */

      // const allPendingBundleRewards = await multicall(herodotusABI, allBundleRequests)
      // allBundleRewards.push(
      //   allPendingBundleRewards.map((apbr, index) => {
      //     return { reward: new BigNumber(apbr), bundleId: index }
      //   }),
      // )
    } else {
      allBundleRewards.push([])
    }
  })

  return allBundleRewards
}
