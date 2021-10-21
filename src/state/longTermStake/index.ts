/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isFetched: false,
  id: '',
  level: '',
  amount: null,
  isPenalty: false,
  periodPenalty: null,
  penaltyUnlockTimestamp: '',
  penaltyFinixAmount: '',
  voteAmount: null,
  canBeUnlock: false,
  penaltyRate: 0,
}

export const longTermSlice = createSlice({
  name: 'Longterm',
  initialState,
  reducers: {
    setUnstakeId: (state, action) => {
      const {
        id,
        level,
        amount,
        isPenalty,
        periodPenalty,
        penaltyUnlockTimestamp,
        penaltyFinixAmount,
        voteAmount,
        canBeUnlock,
        penaltyRate,
      } = action.payload
      state.id = id
      state.level = level
      state.amount = amount
      state.isPenalty = isPenalty
      state.penaltyUnlockTimestamp = penaltyUnlockTimestamp
      state.penaltyFinixAmount = penaltyFinixAmount
      state.voteAmount = voteAmount
      state.canBeUnlock = canBeUnlock
      state.penaltyRate = penaltyRate
      state.periodPenalty = periodPenalty
    },
  },
})

// Actions
export const { setUnstakeId } = longTermSlice.actions

export const fetchIdData =
  (Id, Level, Amount, IsPenalty, CanBeUnlock, PenaltyRate, PeriodPenalty) => async (dispatch) => {
    dispatch(
      setUnstakeId({
        id: Id,
        level: Level,
        amount: Amount,
        isPenalty: IsPenalty,
        canBeUnlock: CanBeUnlock,
        penaltyRate: PenaltyRate,
        periodPenalty: PeriodPenalty,
      }),
    )
  }

export default longTermSlice.reducer
