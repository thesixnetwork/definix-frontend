/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import { Token, Pair, ChainId } from 'definixswap-sdk'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import _ from 'lodash'
import axios from 'axios'
import { createSlice } from '@reduxjs/toolkit'
import { getAddress } from 'utils/addressHelpers'
import { WalletState } from '../types'

const initialState: WalletState = {
  balances: {},
  allowances: {},
  userDeadline: 20,
  userSlippage: 0.8,
}

export const walletSlice = createSlice({
  name: 'Wallet',
  initialState,
  reducers: {
    setBalance: (state, action) => {
      const { account, data } = action.payload
      state.balances = { ...state.balances, [account]: { ..._.get(state, 'balances', {}), ...data } }
    },
    setAllowance: (state, action) => {
      const { account, data } = action.payload
      state.allowances = { ...state.allowances, [account]: { ..._.get(state, 'allowances', {}), ...data } }
    },
    setUserDeadline: (state, action) => {
      state.userDeadline = action.payload
    },
    setUserSlippage: (state, action) => {
      state.userSlippage = action.payload
    },
  },
})

// Actions
export const { setBalance, setAllowance, setUserDeadline, setUserSlippage } = walletSlice.actions

export const setDeadline = (slippage: number) => async dispatch => {
  return dispatch(setUserDeadline(slippage))
}

export const setSlippage = (slippage: number) => async dispatch => {
  return dispatch(setUserSlippage(slippage))
}

export const fetchBalances = (account, addresses: string[]) => async dispatch => {
  // const addressesWithoutMain = addresses.filter(address => address.toLowerCase() !== getAddress(wklay).toLowerCase())
  // const addressMain = addresses.find(address => address.toLowerCase() === getAddress(wklay).toLowerCase())
  // const calls = addressesWithoutMain.map(address => {
  //   return address === getAddress(wklay)
  //     ? {}
  //     : {
  //         address,
  //         name: 'balanceOf',
  //         params: [account],
  //       }
  // })

  // const withoutMainBalances = await multicall(erc20, calls)
  // const mainBalance = addressMain ? await multicallEth(addressMain) : new BigNumber(0)
  const calls = addresses.map(address => {
    return {
      address,
      name: 'balanceOf',
      params: [account],
    }
  })
  const decimalCalls = addresses.map(address => {
    return {
      address,
      name: 'decimals',
    }
  })

  const [balancesResponse, decimalsResponse] = await Promise.all([
    multicall(erc20, calls),
    multicall(erc20, decimalCalls),
  ])
  const data = {}
  addresses.forEach((address, index) => {
    if (!account || !address) return undefined
    data[address] = new BigNumber(balancesResponse[index]).div(new BigNumber(10).pow(decimalsResponse[index]))
    return undefined
  })
  return dispatch(setBalance({ account, data }))
}

export default walletSlice.reducer
