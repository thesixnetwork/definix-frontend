/* eslint-disable no-param-reassign */
// import BigNumber from 'bignumber.js'
// import { Token, Pair, ChainId } from 'definixswap-sdk'
// import erc20 from 'config/abi/erc20.json'
// import multicall from 'utils/multicall'

// import { getDefinixTrade } from 'utils/addressHelpers'
import { getWeb3 } from 'utils/web3'
import { AbiItem } from 'web3-utils'

import _ from 'lodash'
import axios from 'axios'

import { createSlice } from '@reduxjs/toolkit'
import { FinixRegisterState } from '../types'

// import definixTradeABI from '../../config/abi/definixTradeCompetition.json'

// const web3 = getWeb3()
// const definixTradeContract = new web3.eth.Contract((definixTradeABI as unknown) as AbiItem, getDefinixTrade())
// console.log('definixTradeContract =', definixTradeContract)

const initialState: FinixRegisterState = {
  isInitialized: false,
  isLoading: true,
  hasRegistered: false,
  data: null,
}

export const finixRegisterSlice = createSlice({
  name: 'FinixRegister',
  initialState,
  reducers: {
    setRegister: (state, action) => {
      const { register } = action.payload
      state.data = register
    },
  },
})

// Actions
export const { setRegister } = finixRegisterSlice.actions

// Thunks
export const fetchRegister = () => async (dispatch) => {
  const response = await axios.post('https://api.young.definix.com/v1.0/trading-compet-validate')
  console.log('response =', response)

  // dispatch(
  //   setRegister({
  //     register: user,
  //   }),
  // )
}

export default finixRegisterSlice.reducer
