/* eslint-disable no-param-reassign */
import { Toast } from '@fingerlabs/definixswap-uikit-v2'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ToastsState {
  data: Toast[]
}

const initialState: ToastsState = {
  data: [],
}

export const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    push: (state: ToastsState, action: PayloadAction<Toast>) => {
      const { payload } = action
      const toastIndex = state.data.findIndex((toast) => toast.id === action.payload.id)

      // If id already matches remove it before adding it to the top of the stack
      if (toastIndex >= 0) {
        state.data.splice(toastIndex, 1)
      }

      if (state.data.length >= 3) {
        state.data.pop()
      }

      state.data.unshift(payload)
    },
    remove: (state: ToastsState, action: PayloadAction<string>) => {
      const toastIndex = state.data.findIndex((toast) => toast.id === action.payload)

      if (toastIndex >= 0) {
        state.data.splice(toastIndex, 1)
      }
    },
    clear: (state: ToastsState) => {
      state.data = []
    },
  },
})

// Actions
export const { clear, remove, push } = toastsSlice.actions

export default toastsSlice.reducer
