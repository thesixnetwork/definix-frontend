/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import moment from 'moment'
import VaultFacet from 'config/abi/VaultFacet.json'
import VaultInfoFacet from 'config/abi/VaultInfoFacet.json'
import IKIP7 from 'config/abi/IKIP7.json'
import RewardFacet from 'config/abi/RewardFacet.json'
import TokenFacet from 'config/abi/TokenFacet.json'
import multicall from 'utils/multicall'
import { getFinixAddress, getVFinix, getAddress } from 'utils/addressHelpers'
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
  totalSupplyAllTimeMint: 0,
  startIndex: 0,
  allDataLock: [],
  multiplier: 0,
  days: 90,
  vFinixPrice: 0,
  lockCount: 0,
  balanceFinix: 0,
  balancevFinix: 0,
  rewardPerBlock: 0,
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
        multiplier,
        days,
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
      state.multiplier = multiplier
      state.days = days
    },
    setTotalFinixLock: (state, action) => {
      const { totalFinixLock, finixLockMap } = action.payload
      state.totalFinixLock = totalFinixLock
      state.finixLockMap = finixLockMap
    },
    setTotalVFinixSupply: (state, action) => {
      const { totalvFinixSupply, vFinixPrice, rewardPerBlock } = action.payload
      state.totalvFinixSupply = totalvFinixSupply
      state.vFinixPrice = vFinixPrice
      state.rewardPerBlock = rewardPerBlock
    },
    setUserLockAmount: (state, action) => {
      const { userLockAmount, lockCount, balanceFinix, balancevFinix } = action.payload
      state.userLockAmount = userLockAmount
      state.lockCount = lockCount
      state.balanceFinix = balanceFinix
      state.balancevFinix = balancevFinix
    },
    setPendingReward: (state, action) => {
      const { finixEarn } = action.payload
      state.finixEarn = finixEarn
    },
    setAllLockPeriods: (state, action) => {
      const { allLockPeriods } = action.payload
      state.allLockPeriods = allLockPeriods
    },
    setTotalSupplyAllTimeMint: (state, action) => {
      const { totalSupplyAllTimeMint } = action.payload
      state.totalSupplyAllTimeMint = totalSupplyAllTimeMint
    },
    setStartIndex: (state, action) => {
      const { startIndex } = action.payload
      state.startIndex = startIndex
    },
    setAllDataLock: (state, action) => {
      const { allDataLock } = action.payload
      state.allDataLock = allDataLock
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
  setTotalSupplyAllTimeMint,
  setStartIndex,
  setAllDataLock,
} = longTermSlice.actions

export const fetchIdData =
  (Id, Level, Amount, IsPenalty, CanBeUnlock, PenaltyRate, PeriodPenalty, Multiplier, Days) => async (dispatch) => {
    dispatch(
      setUnstakeId({
        id: Id,
        level: Level,
        amount: Amount,
        isPenalty: IsPenalty,
        canBeUnlock: CanBeUnlock,
        penaltyRate: PenaltyRate,
        periodPenalty: PeriodPenalty,
        multiplier: Multiplier,
        days: Days,
      }),
    )
  }

export const fetchStartIndex = (index) => async (dispatch) => {
  dispatch(
    setStartIndex({
      startIndex: index,
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
    const [finixLock] = await multicall(VaultFacet.abi, calls)
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

const getTotalSupplyAllTimeMint = async ({ vFinix }) => {
  let totalFinixLock = 0
  try {
    const calls = [
      {
        address: vFinix,
        name: 'totalSupplyAllTimeMint',
      },
    ]
    const [finixLock] = await multicall(TokenFacet.abi, calls)
    totalFinixLock = new BigNumber(finixLock).dividedBy(new BigNumber(10).pow(18)).toNumber()
  } catch (error) {
    totalFinixLock = 0
  }
  return [totalFinixLock]
}

const getPrivateData = async ({ vFinix, account, index, period, finix }) => {
  let amount = 0
  let lockCount = 0
  let balancevFinix = 0
  let balanceFinix = 0
  let locksData = []
  try {
    const calls = [
      // {
      //   address: vFinix,
      //   name: 'getUserLockAmount',
      //   params: [account],
      // },
      // {
      //   address: vFinix,
      //   name: 'locks',
      //   params: [account, index, 10],
      // },
      {
        address: vFinix,
        name: 'lockCount',
        params: [account],
      },
    ]
    const callInfoFacet = [
      {
        address: vFinix,
        name: 'getUserLockAmount',
        params: [account],
      },
      {
        address: vFinix,
        name: 'locksDesc',
        params: [account, index, 10],
      },
    ]
    const calBalance = [
      {
        address: finix,
        name: 'balanceOf',
        params: [account],
      },
      {
        address: vFinix,
        name: 'balanceOf',
        params: [account],
      },
    ]
    const [count] = await multicall(VaultFacet.abi, calls)
    const [lockAmount, infoFacet] = await multicall(VaultInfoFacet.abi, callInfoFacet)
    const [balanceOfFinix, balanceOfvFinix] = await multicall(IKIP7.abi, calBalance)
    balanceFinix = new BigNumber(balanceOfFinix).dividedBy(new BigNumber(10).pow(18)).toNumber()
    balancevFinix = new BigNumber(balanceOfvFinix).dividedBy(new BigNumber(10).pow(18)).toNumber()
    const result = _.get(infoFacet, 'locks_')
    let canBeUnlock_
    let canBeClaim_
    let asDays = 0
    let asPenaltyDays = 0
    const days = [90, 180, 365]
    result.map((value) => {
      canBeUnlock_ =
        Math.floor(new Date().getTime() / 1000) - _.get(period, '0.periodMap')[value.level] >
        new BigNumber(_.get(value, 'lockTimestamp._hex')).toNumber()
      canBeClaim_ =
        Math.floor(new Date().getTime() / 1000) - _.get(period, '0.periodMap')[value.level] >
        new BigNumber(_.get(value, 'penaltyUnlockTimestamp._hex')).toNumber()
      asDays = moment.duration({ seconds: _.get(period, '0.periodMap')[value.level] }).asDays()
      asPenaltyDays = moment.duration({ seconds: _.get(period, '0.penaltyPeriod')[value.level] }).asDays()

      let lockTimes = new Date(new BigNumber(_.get(value, 'lockTimestamp._hex')).toNumber() * 1000)
      lockTimes.setDate(lockTimes.getDate() + asDays)
      lockTimes = new Date(lockTimes)

      let penaltyTimestamp = new Date(new BigNumber(_.get(value, 'penaltyUnlockTimestamp._hex')).toNumber() * 1000)
      penaltyTimestamp.setDate(penaltyTimestamp.getDate() + asPenaltyDays)
      penaltyTimestamp = new Date(penaltyTimestamp)

      let unLockTime = new Date(new BigNumber(_.get(value, 'lockTimestamp._hex')).toNumber() * 1000)
      unLockTime.setDate(unLockTime.getDate() + asPenaltyDays)
      unLockTime = new Date(unLockTime)

      const offset = 2
      const utcLock = lockTimes.getTime()
      const utcPenalty = penaltyTimestamp.getTime()
      const utcUnLock = unLockTime.getTime()
      let nd = new Date(utcLock + 3600000 * offset)
      let pt = new Date(utcPenalty + 3600000 * offset)
      let ul = new Date(utcUnLock + 3600000 * offset)
      const dateTime = lockTimes.getTimezoneOffset() / 60
      const dateTimePenalty = penaltyTimestamp.getTimezoneOffset() / 60
      const dateTimeUnLock = unLockTime.getTimezoneOffset() / 60
      if (dateTime === -9) {
        nd = new Date()
      }

      if (dateTimePenalty === -9) {
        pt = new Date()
      }

      if (dateTimeUnLock === -9) {
        ul = new Date()
      }

      let claim
      if (canBeClaim_) {
        if (new BigNumber(_.get(value, 'penaltyUnlockTimestamp._hex')).toNumber() !== 0) {
          claim = canBeClaim_
        } else {
          claim = false
        }
      } else {
        claim = false
      }

      let Unlock
      if (canBeUnlock_) {
        Unlock = canBeUnlock_
      } else {
        Unlock = false
      }
      locksData.push({
        id: new BigNumber(_.get(value, 'id._hex')).toNumber(),
        level: value.level * 1 + 1,
        isUnlocked: value.isUnlocked,
        isPenalty: value.isPenalty,
        flg: value.isPenalty && value.isUnlocked,
        penaltyFinixAmount: new BigNumber(_.get(value, 'penaltyFinixAmount._hex'))
          .dividedBy(new BigNumber(10).pow(18))
          .toNumber(),
        penaltyUnlockTimestamp: moment(pt).format(`DD-MMM-YY HH:mm:ss`),
        canBeUnlock: Unlock,
        canBeClaim: claim,
        lockTimestamp: moment(nd).format(`DD-MMM-YY HH:mm:ss`),
        penaltyRate: _.get(period, '0.realPenaltyRate')[value.level] * 100,
        lockAmount: new BigNumber(_.get(value, 'lockAmount._hex')).dividedBy(new BigNumber(10).pow(18)).toNumber(),
        voteAmount: new BigNumber(_.get(value, 'voteAmount._hex')).dividedBy(new BigNumber(10).pow(18)).toNumber(),
        periodPenalty: moment(ul).format(`DD-MMM-YY HH:mm:ss`),
        multiplier: _.get(period, '0.multiplier')[value.level * 1 + 1 - 1],
        days: days[value.level * 1 + 1 - 1],
      })
      return locksData
    })
    amount = new BigNumber(lockAmount).dividedBy(new BigNumber(10).pow(18)).toNumber()
    lockCount = new BigNumber(count).toNumber()
  } catch (error) {
    amount = 0
    lockCount = 0
    locksData = []
  }
  return [amount, locksData, lockCount, balanceFinix, balancevFinix]
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
        address: vFinix,
        name: 'getAllLockPeriods',
      },
    ]
    const [lockPeriods] = await multicall(VaultFacet.abi, calls)
    for (let i = 0; i < 3; i++) {
      _.set(periodMap, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_period${i + 1}._hex`)).toNumber())
      _.set(
        minimum,
        `${i}`,
        new BigNumber(_.get(lockPeriods.param_, `_minimum${i + 1}._hex`))
          .dividedBy(new BigNumber(10).pow(18))
          .toNumber(),
      )
      _.set(multiplier, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_multiplier${i + 1}._hex`)).toNumber() / 10)
      _.set(penaltyPeriod, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_penaltyPeriod${i + 1}._hex`)).toNumber())
      _.set(penaltyRate, `${i}`, new BigNumber(_.get(lockPeriods.param_, `_penaltyRate${i + 1}._hex`)).toNumber())
      _.set(
        penaltyRateDecimal,
        `${i}`,
        new BigNumber(_.get(lockPeriods.param_, `_penaltyRateDecimal${i + 1}._hex`)).toNumber(),
      )
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
  let reward = 0
  let vFinixPrice = 0
  let rewardPerBlock = 0
  try {
    const calls = [
      {
        address: vFinix,
        name: 'totalSupply',
      },
    ]
    const callrewardPerBlock = [
      {
        address: vFinix,
        name: 'rewardPerBlock',
      },
    ]
    const [totalvfinixSupply] = await multicall(IKIP7.abi, calls)
    const [rewardPerBlockResponse] = await multicall(RewardFacet.abi, callrewardPerBlock)
    rewardPerBlock = rewardPerBlockResponse
    totalSupply = new BigNumber(totalvfinixSupply).dividedBy(new BigNumber(10).pow(18)).toNumber()
    reward = new BigNumber(rewardPerBlock).dividedBy(new BigNumber(10).pow(18)).toNumber()
    vFinixPrice = ((reward * 86400 * 365) / Number(totalSupply)) * 100
  } catch (error) {
    vFinixPrice = 0
    totalSupply = 0
    rewardPerBlock = 0
  }
  return [totalSupply, vFinixPrice, rewardPerBlock]
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

export const fetchTotalSupplyAllTimeMint = () => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getTotalSupplyAllTimeMint({
      vFinix: getVFinix(),
    }),
  )
  const [[totalSupply]] = await Promise.all(fetchPromise)
  dispatch(setTotalSupplyAllTimeMint({ totalSupplyAllTimeMint: totalSupply }))
}

export const fetchPrivateData = (account, index, period) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getPrivateData({
      vFinix: getVFinix(),
      account,
      index,
      period,
      finix: getFinixAddress(),
    }),
  )
  const [[lockAmount, lockData, count, finix, vFinix]] = await Promise.all(fetchPromise)
  dispatch(
    setUserLockAmount({ userLockAmount: lockAmount, lockCount: count, balanceFinix: finix, balancevFinix: vFinix }),
  )
  dispatch(setAllDataLock({ allDataLock: lockData }))
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
  const [[totalSupplyVFinix, vFinix, rewardPerBlock]] = await Promise.all(fetchPromise)
  dispatch(setTotalVFinixSupply({ totalvFinixSupply: totalSupplyVFinix, vFinixPrice: vFinix, rewardPerBlock }))
}

export default longTermSlice.reducer
