/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farms'
import axios from 'axios'
import _ from 'lodash-es'
import fetchFarms from './fetchFarms'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
  fetchFarmPendingRewards,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'

const initialState: FarmsState = { isFetched: false, data: [...farmsConfig], farmUnlockAt: undefined }

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.isFetched = true
    },
    setFarmUnlockAt: (state, action) => {
      const { farmUnlockAt } = action.payload
      state.farmUnlockAt = farmUnlockAt
    },
  },
})

// Actions
export const { setFarmsPublicData, setFarmUserData, setFarmUnlockAt } = farmsSlice.actions

// Thunks
export const fetchFarmsPublicDataAsync = () => async (dispatch) => {
  const farms = await fetchFarms()
  dispatch(setFarmsPublicData(farms))
}
export const fetchFarmUnlockDate = () => async (dispatch) => {
  const response = await axios.get('https://api.bscscan.com/api?module=block&action=getblockcountdown&blockno=6332527')
  const timeInsecToUnlock = parseInt(_.get(response, 'data.result.EstimateTimeInSec'), 10) || 0
  const unlockDate = new Date(new Date().getTime() + timeInsecToUnlock * 1000)
  dispatch(setFarmUnlockAt({ farmUnlockAt: unlockDate }))
}
export const fetchFarmUserDataAsync = (account) => async (dispatch) => {
  const userFarmAllowances = await fetchFarmUserAllowances(account)
  const userFarmTokenBalances = await fetchFarmUserTokenBalances(account)
  const userStakedBalances = await fetchFarmUserStakedBalances(account)
  const userFarmEarnings = await fetchFarmUserEarnings(account)
  const userPendingRewards = await fetchFarmPendingRewards(account)

  const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
    return {
      index,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
      pendingRewards: userPendingRewards[index],
    }
  })

  dispatch(setFarmUserData({ arrayOfUserDataObjects }))
}

export default farmsSlice.reducer
