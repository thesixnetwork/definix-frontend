import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import herodotusABI from 'config/abi/herodotus.json'
import multicall from 'utils/multicall'
import farmsConfig from 'config/constants/farms'
import { getAddress, getHerodotusAddress } from 'utils/addressHelpers'

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
