/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import VaultFacet from 'config/abi/VaultFacet.json'
import multicall from 'utils/multicall'
import { getFinixAddress, getVFinix } from 'utils/addressHelpers'
import _ from 'lodash'

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
  totalFinixLock: 0,
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
    setTotalFinixLock: (state, action) => {
      const { totalFinixLock } = action.payload
      state.totalFinixLock = totalFinixLock
    },
  },
})

// Actions
export const { setUnstakeId, setTotalFinixLock } = longTermSlice.actions

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

const getVaultFacet = async ({ vFinix }) => {
  let totalFinixLock = 0
  try {
    const calls = [
      {
        address: vFinix,
        name: 'getTotalFinixLock',
      }
    ]
    const [pair1BalanceLP] = await multicall(VaultFacet.abi, calls)
    totalFinixLock = new BigNumber(
      _.get(pair1BalanceLP, 'totalFinixLock_').dividedBy(new BigNumber(10).pow(18)),
    ).toNumber()
  } catch (error) {
    totalFinixLock = 0
    console.log('error', error)
  }
  return [totalFinixLock]
}

export const fetchVaultFacet = () => async (dispatch) => {
  const fetchPromise = []

  fetchPromise.push(
    getVaultFacet({
      vFinix: getVFinix(),
    }),
  )
  const [[totalFinix]] = await Promise.all(fetchPromise)
  dispatch(setTotalFinixLock({ totalFinixLock: totalFinix }))
}

export default longTermSlice.reducer
