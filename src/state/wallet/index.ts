/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import rebalanceAbi from 'config/abi/rebalance.json'
import multicall, { multicallEth } from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { get } from 'lodash-es'
import { createSlice } from '@reduxjs/toolkit'
import { WalletState, Rebalance } from '../types'

const initialState: WalletState = {
  userRebalanceBalances: {},
  balances: {},
  allowances: {},
  decimals: {},
  userDeadline: 1200,
  userSlippage: 50,
  isFetched: false,
  isRebalanceFetched: false,

  account: '',
  connector: '',
}

export const walletSlice = createSlice({
  name: 'Wallet',
  initialState,
  reducers: {
    setDecimals: (state, action) => {
      const { account, data } = action.payload
      state.decimals = { ...state.decimals, [account]: { ...get(state, `decimals.${account}`, {}), ...data } }
    },
    setBalance: (state, action) => {
      const { account, data } = action.payload
      state.balances = { ...state.balances, [account]: { ...get(state, `balances.${account}`, {}), ...data } }
      state.isFetched = true
    },
    setUserRabalanceBalance: (state, action) => {
      const { account, data } = action.payload
      state.userRebalanceBalances = {
        ...state.userRebalanceBalances,
        [account]: { ...get(state, `userRebalanceBalances.${account}`, {}), ...data },
      }
      state.isRebalanceFetched = true
    },
    setAllowance: (state, action) => {
      const { account, data, spender } = action.payload
      state.allowances = {
        ...state.allowances,
        [account]: {
          ...get(state, `allowances.${account}`, {}),
          [spender]: { ...get(state, `allowances.${account}.${spender}`, {}), ...data },
        },
      }
    },
    setUserDeadline: (state, action) => {
      state.userDeadline = action.payload
    },
    setUserSlippage: (state, action) => {
      state.userSlippage = action.payload
    },
    setUserAccount: (state, action) => {
      state.account = action.payload
    },
    setUserConnector: (state, action) => {
      state.connector = action.payload
    },
  },
})

// Actions
export const {
  setUserRabalanceBalance,
  setBalance,
  setAllowance,
  setUserDeadline,
  setUserSlippage,
  setDecimals,
  setUserAccount,
  setUserConnector,
} = walletSlice.actions

export const setDeadline = (slippage: number) => async (dispatch) => {
  return dispatch(setUserDeadline(slippage))
}

export const setSlippage = (slippage: number) => async (dispatch) => {
  return dispatch(setUserSlippage(slippage))
}

export const setAccount = (account: string) => async (dispatch) => {
  return dispatch(setUserAccount(account))
}

export const setConnector = (connector: string) => async (dispatch) => {
  return dispatch(setUserConnector(connector))
}

export const fetchAllowances = (account: string, addresses: string[], spender: string) => async (dispatch) => {
  const allowanceCalls = addresses.map((address) => {
    return {
      address,
      name: 'allowance',
      params: [account, spender],
    }
  })

  const [allowancesData] = await Promise.all([multicall(erc20, allowanceCalls)])
  const data = {}
  addresses.forEach((address, index) => {
    if (!account || !address) return undefined
    data[address] = new BigNumber(allowancesData[index])
    return undefined
  })
  return dispatch(setAllowance({ account, data, spender }))
}

export const fetchRebalanceBalances = (account, rebalances: Rebalance[]) => async (dispatch) => {
  const autoCompoundCalls = rebalances
    .filter((r) => r.enableAutoCompound && r.autoHerodotus)
    .map((r) => {
      return {
        address: r.autoHerodotus,
        name: 'rebalanceUserLPAmount',
        params: [getAddress(r.address), account],
      }
    })
  const autoCompoundResponse = await multicall(rebalanceAbi, autoCompoundCalls)
  await fetchBalances(
    account,
    rebalances.filter((r) => !r.enableAutoCompound || !r.autoHerodotus).map((r) => getAddress(r.address)),
  )(dispatch)

  const data = {}
  rebalances
    .filter((r) => r.enableAutoCompound && r.autoHerodotus)
    .map((r, index) => {
      if (!account || !getAddress(r.address)) return undefined
      data[getAddress(r.address)] = new BigNumber(autoCompoundResponse[index]).div(new BigNumber(10).pow(18))
      return undefined
    })
  return dispatch(setUserRabalanceBalance({ account, data }))
}

export const fetchBalances = (account, addresses: string[]) => async (dispatch) => {
  const calls = addresses.map((address) => {
    return {
      address,
      name: 'balanceOf',
      params: [account],
    }
  })
  const decimalCalls = addresses.map((address) => {
    return {
      address,
      name: 'decimals',
    }
  })

  const mainBalance = await multicallEth(account)
  const [balancesResponse, decimalsResponse] = await Promise.all([
    multicall(erc20, calls),
    multicall(erc20, decimalCalls),
  ])
  const data: Record<string, BigNumber> = {}
  const dataDecimals: Record<string, BigNumber> = {}
  addresses.forEach((address, index) => {
    if (!account || !address) return undefined
    data[address] = new BigNumber(balancesResponse[index]).div(new BigNumber(10).pow(decimalsResponse[index]))
    dataDecimals[address] = new BigNumber(decimalsResponse[index])
    return undefined
  })
  data.main = new BigNumber(mainBalance).div(new BigNumber(10).pow(18))
  dataDecimals.main = new BigNumber(18)
  await dispatch(setDecimals(dataDecimals))
  return dispatch(setBalance({ account, data }))
}

export default walletSlice.reducer
