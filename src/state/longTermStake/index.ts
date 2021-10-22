/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import VaultFacet from 'config/abi/VaultFacet.json'
import IKIP7 from 'config/abi/IKIP7.json'
import RewardFacet from 'config/abi/RewardFacet.json'
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
  totalvFinixSupply: 0,
  finixLockMap: [],
  userLockAmount: 0,
  finixEarn: 0,
  allLockPeriods: [],
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
      const { totalFinixLock, finixLockMap } = action.payload
      state.totalFinixLock = totalFinixLock
      state.finixLockMap = finixLockMap
    },
    setTotalVFinixSupply: (state, action) => {
      const { totalvFinixSupply } = action.payload
      state.totalvFinixSupply = totalvFinixSupply
    },
    setUserLockAmount: (state, action) => {
      const { userLockAmount } = action.payload
      state.userLockAmount = userLockAmount
    },
    setPendingReward: (state, action) => {
      const { finixEarn } = action.payload
      state.finixEarn = finixEarn
    },
    setAllLockPeriods: (state, action) => {
      const { allLockPeriods } = action.payload
      state.allLockPeriods = allLockPeriods
    },
  },
})

// Actions
export const {
  setUnstakeId,
  setTotalFinixLock,
  setTotalVFinixSupply,
  setUserLockAmount,
  setPendingReward,
  setAllLockPeriods,
} = longTermSlice.actions

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
  const finixLockMap = []
  try {
    const calls = [
      {
        address: vFinix,
        name: 'getTotalFinixLock',
      },
    ]
    const [finixLock, lockAmonut] = await multicall(VaultFacet.abi, calls)
    for (let i = 0; i < 3; i++) {
      _.set(
        finixLockMap,
        `${i}`,
        numeral(
          new BigNumber(_.get(finixLock, `totalFinixLockAtLevel${i + 1}_._hex`)).dividedBy(new BigNumber(10).pow(18)),
        ).format('0'),
      )
    }

    totalFinixLock = new BigNumber(_.get(finixLock, 'totalFinixLock_._hex'))
      .dividedBy(new BigNumber(10).pow(18))
      .toNumber()
  } catch (error) {
    totalFinixLock = 0
  }
  return [totalFinixLock, finixLockMap]
}

const getPrivateData = async ({ vFinix, account }) => {
  let ulockAmount = 0
  const finixLockMap = []
  const periodMap = {}
  const minimum = {}
  const multiplier = {}
  const penaltyPeriod = {}
  const penaltyRate = {}
  const penaltyRateDecimal = {}
  const calPenaltyRate = {}
  try {
    const calls = [
      {
        address: vFinix,
        name: 'getUserLockAmount',
        params: [account],
      },
      {
        address: vFinix,
        name: 'locks',
        params: [account, 10 * 0, 10],
      },
    ]
    const [lockAmount, locks] = await multicall(VaultFacet.abi, calls)
    ulockAmount = new BigNumber(lockAmount).dividedBy(new BigNumber(10).pow(18)).toNumber()
  } catch (error) {
    ulockAmount = 0
  }
  return [ulockAmount]
}

const getAllLockPeriods = async ({ vFinix }) => {
  let lockPeriod = []
  const periodMap = {}
  const minimum = {}
  const multiplier = [{}]
  const penaltyPeriod = {}
  const penaltyRate = {}
  const penaltyRateDecimal = {}
  const realPenaltyRate = {}
  try {
    const calls = [
      {
        // address: '0xDD3F8597FA8F68fCDEf328748163e558e4D44d5A',
        address: vFinix,
        name: 'getAllLockPeriods',
      },
    ]
    const [lockPeriods] = await multicall(VaultFacet.abi, calls)
    for (let i = 0; i < 3; i++) {
      _.set(periodMap, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_period${i + 1}._hex`)).toNumber())
      _.set(minimum, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_minimum${i + 1}._hex`)).dividedBy(new BigNumber(10).pow(18)).toNumber())
      _.set(multiplier, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_multiplier${i + 1}._hex`)).toNumber() / 10)
      _.set(penaltyPeriod, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_penaltyPeriod${i + 1}._hex`)).toNumber())
      _.set(penaltyRate, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_penaltyRate${i + 1}._hex`)).toNumber())
      _.set(penaltyRateDecimal, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_penaltyRateDecimal${i + 1}._hex`)).toNumber())
      _.set(
        realPenaltyRate,
        `${i}`,
        Number(
          new BigNumber(_.get(lockPeriods.param_, `_penaltyRate${i + 1}._hex`))
            .dividedBy(_.get(lockPeriods.param_, `_penaltyRateDecimal${i + 1}._hex`))
            .toFixed(),
        ),
      )
    }
    lockPeriod.push({
      periodMap,
      minimum,
      multiplier,
      penaltyPeriod,
      penaltyRate,
      penaltyRateDecimal,
      realPenaltyRate,
    })
  } catch (error) {
    lockPeriod = []
  }
  return [lockPeriod]
}

const getPendingReward = async ({ vFinix, account }) => {
  let pendingReward = 0
  try {
    const calls = [
      {
        address: vFinix,
        name: 'pendingReward',
        params: [account],
      },
    ]
    const [earn] = await multicall(RewardFacet.abi, calls)
    pendingReward = new BigNumber(earn).dividedBy(new BigNumber(10).pow(18)).toNumber()
  } catch (error) {
    pendingReward = 0
  }
  return [pendingReward]
}

const getContactIKIP7 = async ({ vFinix }) => {
  let totalSupply = 0
  try {
    const calls = [
      {
        address: vFinix,
        name: 'totalSupply',
      },
    ]
    const [totalvfinixSupply] = await multicall(IKIP7.abi, calls)
    totalSupply = new BigNumber(totalvfinixSupply).dividedBy(new BigNumber(10).pow(18)).toNumber()
  } catch (error) {
    totalSupply = 0
  }
  return [totalSupply]
}

export const fetchVaultFacet = () => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getVaultFacet({
      vFinix: getVFinix(),
    }),
  )
  const [[totalFinix, finixMap]] = await Promise.all(fetchPromise)
  dispatch(setTotalFinixLock({ totalFinixLock: totalFinix, finixLockMap: finixMap }))
}

export const fetchPrivateData = (account) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getPrivateData({
      vFinix: getVFinix(),
      account,
    }),
  )
  const [[lockAmount]] = await Promise.all(fetchPromise)
  dispatch(setUserLockAmount({ userLockAmount: lockAmount }))
}

export const fetchPendingReward = (account) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getPendingReward({
      vFinix: getVFinix(),
      account,
    }),
  )
  const [[earn]] = await Promise.all(fetchPromise)
  dispatch(setPendingReward({ finixEarn: earn }))
}

export const fetchAllLockPeriods = () => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getAllLockPeriods({
      vFinix: getVFinix(),
    }),
  )
  const [[lockPeriod]] = await Promise.all(fetchPromise)
  dispatch(setAllLockPeriods({ allLockPeriods: lockPeriod }))
}

export const fetchVaultIKIP7 = () => async (dispatch) => {
  const fetchPromise = []

  fetchPromise.push(
    getContactIKIP7({
      vFinix: getVFinix(),
    }),
  )
  const [[totalSupplyVFinix]] = await Promise.all(fetchPromise)
  dispatch(setTotalVFinixSupply({ totalvFinixSupply: totalSupplyVFinix }))
}

export default longTermSlice.reducer
