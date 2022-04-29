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
import { getFinixAddress, getVFinix } from 'utils/addressHelpers'
import { get, set } from 'lodash-es'
import { getContract } from 'utils/caver'

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
  countTransactions: 0,
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
    setCountTransactions: (state, action) => {
      const { countTransactions } = action.payload
      state.countTransactions = countTransactions
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
  setCountTransactions,
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

export const fetchCountTransactions = (count) => async (dispatch) => {
  dispatch(
    setCountTransactions({
      countTransactions: count,
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
      set(
        finixLockMap,
        `${i}`,
        numeral(
          new BigNumber(get(finixLock, `totalFinixLockAtLevel${i + 1}_._hex`)).dividedBy(new BigNumber(10).pow(18)),
        ).format('0'),
      )
    }

    totalFinixLock = new BigNumber(get(finixLock, 'totalFinixLock_._hex'))
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
        params: [account, index, 1000],
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
    const callContract = getContract(VaultInfoFacet.abi, getVFinix())
    const finixLock = await callContract.methods.locksDesc(account, index, 10).call({ from: account })
    balanceFinix = new BigNumber(balanceOfFinix).dividedBy(new BigNumber(10).pow(18)).toNumber()
    balancevFinix = new BigNumber(balanceOfvFinix).dividedBy(new BigNumber(10).pow(18)).toNumber()
    const result = get(infoFacet, 'locks_')
    const topup = get(finixLock, 'locksTopup')
    let canBeUnlock_
    let canBeClaim_
    let asDays = 0
    let asPenaltyDays = 0
    const days = [90, 180, 365]
    result.map((value) => {
      canBeUnlock_ =
        Date.now() >
        (new BigNumber(get(value, 'lockTimestamp._hex')).toNumber() + get(period, '0.periodMap')[value.level]) * 1000
      canBeClaim_ =
        Date.now() >
        (new BigNumber(get(value, 'penaltyUnlockTimestamp._hex')).toNumber() +
          get(period, '0.penaltyPeriod')[value.level]) *
          1000
      asDays =
        process.env.REACT_APP_CHAIN_ID === '1001'
          ? days[value.level]
          : moment.duration({ seconds: get(period, '0.periodMap')[value.level] }).asDays()
      asPenaltyDays = moment.duration({ seconds: get(period, '0.penaltyPeriod')[value.level] }).asDays()

      let lockTimes = new Date(new BigNumber(get(value, 'lockTimestamp._hex')).toNumber() * 1000)
      lockTimes.setDate(lockTimes.getDate() + asDays)
      lockTimes = new Date(lockTimes)

      let lockTopup = new Date(new BigNumber(get(value, 'lockTimestamp._hex')).toNumber() * 1000)
      lockTopup.setDate(lockTopup.getDate())
      lockTopup = new Date(lockTopup)

      let penaltyTimestamp = new Date(new BigNumber(get(value, 'penaltyUnlockTimestamp._hex')).toNumber() * 1000)
      penaltyTimestamp.setDate(penaltyTimestamp.getDate() + asPenaltyDays)
      penaltyTimestamp = new Date(penaltyTimestamp)

      let unLockTime = new Date(new BigNumber(get(value, 'lockTimestamp._hex')).toNumber() * 1000)
      unLockTime.setDate(unLockTime.getDate() + asPenaltyDays)
      unLockTime = new Date(unLockTime)

      const timeZone = new Date().getTimezoneOffset() / 60
      const offset = timeZone === -7 && 2
      const utcLock = lockTimes.getTime()
      const utcLockTopup = lockTopup.getTime()
      const utcPenalty = penaltyTimestamp.getTime()
      // const utcUnLock = unLockTime.getTime()
      const lock = new Date(utcLock + 3600000 * offset)
      const topupTime = new Date(utcLockTopup + 3600000 * offset)
      const penaltyUnlock = new Date(utcPenalty + 3600000 * offset)
      // const unLock = new Date(utcUnLock + 3600000 * offset)

      let periodPenalty
      const date = new Date()
      if (get(value, 'level') === 0) {
        date.setDate(date.getDate() + 7)
        periodPenalty = new Date(date.getTime() + 3600000 * offset)
      } else if (get(value, 'level') === 1) {
        date.setDate(date.getDate() + 14)
        periodPenalty = new Date(date.getTime() + 3600000 * offset)
      } else if (get(value, 'level') === 2) {
        date.setDate(date.getDate() + 28)
        periodPenalty = new Date(date.getTime() + 3600000 * offset)
      }
      const isTopup = topup.indexOf(new BigNumber(get(value, 'id._hex')).toString()) > -1

      locksData.push({
        id: new BigNumber(get(value, 'id._hex')).toNumber(),
        level: value.level * 1 + 1,
        isUnlocked: value.isUnlocked,
        isPenalty: value.isPenalty,
        isTopup,
        flg: value.isPenalty && value.isUnlocked,
        penaltyFinixAmount: new BigNumber(get(value, 'penaltyFinixAmount._hex'))
          .dividedBy(new BigNumber(10).pow(18))
          .toNumber(),
        penaltyUnlockTimestamp: moment(penaltyUnlock).format(`DD-MMM-YY HH:mm:ss`),
        canBeUnlock: canBeUnlock_,
        canBeClaim: canBeClaim_,
        lockTimestamp: moment(lock).format(`DD-MMM-YY HH:mm:ss`),
        lockTopupTimes: moment(topupTime).format(`DD-MMM-YY HH:mm:ss`),
        penaltyRate: get(period, '0.realPenaltyRate')[value.level] * 100,
        lockAmount: new BigNumber(get(value, 'lockAmount._hex')).dividedBy(new BigNumber(10).pow(18)).toNumber(),
        voteAmount: new BigNumber(get(value, 'voteAmount._hex')).dividedBy(new BigNumber(10).pow(18)).toNumber(),
        periodPenalty: moment(periodPenalty).format(`DD-MMM-YY HH:mm:ss`),
        multiplier: get(period, '0.multiplier')[value.level * 1 + 1 - 1],
        days: isTopup ? 28 : days[value.level * 1 + 1 - 1],
        topup,
        topupTimeStamp: moment(new Date(topupTime.setDate(topupTime.getDate() + 28))).format(`DD-MMM-YY HH:mm:ss`),
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
    const [lockPeriods] = await multicall(VaultInfoFacet.abi, calls)
    for (let i = 0; i < 3; i++) {
      set(periodMap, `${i}`, new BigNumber(get(lockPeriods.param_, `_period${i + 1}._hex`)).toNumber())
      set(
        minimum,
        `${i}`,
        new BigNumber(get(lockPeriods.param_, `_minimum${i + 1}._hex`)).dividedBy(new BigNumber(10).pow(18)).toNumber(),
      )
      set(multiplier, `${i}`, new BigNumber(get(lockPeriods.param_, `_multiplier${i + 1}._hex`)).toNumber() / 10)
      set(penaltyPeriod, `${i}`, new BigNumber(get(lockPeriods.param_, `_penaltyPeriod${i + 1}._hex`)).toNumber())
      set(penaltyRate, `${i}`, new BigNumber(get(lockPeriods.param_, `_penaltyRate${i + 1}._hex`)).toNumber())
      set(
        penaltyRateDecimal,
        `${i}`,
        new BigNumber(get(lockPeriods.param_, `_penaltyRateDecimal${i + 1}._hex`)).toNumber(),
      )
      set(
        realPenaltyRate,
        `${i}`,
        Number(
          new BigNumber(get(lockPeriods.param_, `_penaltyRate${i + 1}._hex`))
            .dividedBy(get(lockPeriods.param_, `_penaltyRateDecimal${i + 1}._hex`))
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
