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
      const { data } = action.payload
      state.balances = data
    },
  },
})

// Actions
export const { setBalance } = walletSlice.actions

export default walletSlice.reducer
