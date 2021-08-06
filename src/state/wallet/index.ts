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
}

export const walletSlice = createSlice({
  name: 'Wallet',
  initialState,
  reducers: {
    setBalance: (state, action) => {
      const { account, data } = action.payload
      state.balances = { ...state.balances, [account]: { ..._.get(state, 'balances', {}), ...data } }
    },
  },
})

// Actions
export const { setBalance } = walletSlice.actions

export const fetchBalances = (account, addresses: string[]) => async (dispatch) => {
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
  const calls = addresses.map((address) => {
    return {
      address,
      name: 'balanceOf',
      params: [account],
    }
  })

  const balancesResponse = await multicall(erc20, calls)
  const data = {}
  addresses.forEach((address, index) => {
    if (!account || !address) return undefined
    data[address] = balancesResponse[index]
    return undefined
  })
  return dispatch(setBalance({ account, data }))
}

export default walletSlice.reducer
