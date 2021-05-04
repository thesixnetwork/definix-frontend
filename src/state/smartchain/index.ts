/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SmartChainState } from 'state/types'

const initialState: SmartChainState = {
  name: '',
}

export const smartchainSlice = createSlice({
  name: 'SmartChain',
  initialState,
  reducers: {
    setSmartChain: (state, action) => {
      const { name } = action.payload
      state.name = name
    },
  },
})

// Actions
export const { setSmartChain } = smartchainSlice.actions

export const setCurrentSmartChain = (smartchain: SmartChainState) => async (dispatch) => {
  dispatch(setSmartChain(smartchain))
}

export default smartchainSlice.reducer
