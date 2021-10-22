/* eslint-disable no-shadow */
import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import moment from 'moment'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { provider } from 'web3-core'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPrivateData, fetchPendingReward, fetchAllLockPeriods } from '../state/actions'
import IKIP7 from '../config/abi/IKIP7.json'
import VaultFacet from '../config/abi/VaultFacet.json'
import RewardFacet from '../config/abi/RewardFacet.json'
import VaultPenaltyFacet from '../config/abi/VaultPenaltyFacet.json'
import { getContract } from '../utils/caver'
import { getTokenBalance } from '../utils/erc20'
import { getFinixAddress, getVFinix } from '../utils/addressHelpers'
import useRefresh from './useRefresh'
import { State } from '../state/types'

const useLongTermStake = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(klaytn, tokenAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && klaytn) {
      fetchBalance()
    }
  }, [account, klaytn, tokenAddress, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<string>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const finixContract = getContract(IKIP7.abi, getVFinix())
      const supply = await finixContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply).dividedBy(new BigNumber(10).pow(18)).toString())
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useTotalFinixLock = () => {
  const { slowRefresh } = useRefresh()
  const [totalFinixLock, setTotalFinixLock] = useState([])

  useEffect(() => {
    async function fetchTotalFinixLock() {
      const finixLock = getContract(VaultFacet.abi, getVFinix())
      const supply = await finixLock.methods.getTotalFinixLock().call()
      const finixLockMap = []
      for (let i = 0; i < 3; i++) {
        _.set(
          finixLockMap,
          `${i}`,
          numeral(
            new BigNumber(_.get(supply, `totalFinixLockAtLevel${i + 1}_`)).dividedBy(new BigNumber(10).pow(18)),
          ).format('0'),
        )
      }
      setTotalFinixLock(finixLockMap)
    }

    fetchTotalFinixLock()
  }, [slowRefresh])

  return totalFinixLock
}

export const useApr = () => {
  const { slowRefresh } = useRefresh()
  const [apr, setApr] = useState<number>()

  useEffect(() => {
    async function fetchApr() {
      const finixLock = getContract(RewardFacet.abi, getVFinix())
      const supply = await finixLock.methods.rewardPerBlock().call()
      setApr(new BigNumber(supply).dividedBy(new BigNumber(10).pow(18)).toNumber())
    }

    fetchApr()
  }, [slowRefresh])

  return apr
}

export const useBalances = () => {
  const { slowRefresh } = useRefresh()
  const [balance, setBalanceOf] = useState(new BigNumber(0))
  const { account } = useWallet()

  useEffect(() => {
    async function fetchBalance() {
      const finixBalance = getContract(IKIP7.abi, getFinixAddress())
      try {
        const res = await finixBalance.methods.balanceOf(account).call()
        setBalanceOf(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)))
      } catch (e) {
        setBalanceOf(null)
      }
    }

    fetchBalance()
  }, [slowRefresh, account])

  return balance
}

export const useLockAmount = () => {
  const { slowRefresh } = useRefresh()
  const [balance, setBalanceOf] = useState(new BigNumber(0))
  const { account } = useWallet()

  useEffect(() => {
    async function fetchBalance() {
      const finixBalance = getContract(VaultFacet.abi, getVFinix())
      try {
        const res = await finixBalance.methods.getUserLockAmount(account).call()
        setBalanceOf(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)))
      } catch (e) {
        setBalanceOf(null)
      }
    }

    fetchBalance()
  }, [slowRefresh, account])

  return balance
}

export const usePrivateData = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
  const [balance, setBalanceOf] = useState(new BigNumber(0))
  const { account } = useWallet()

  useEffect(() => {
    if (account) {
      dispatch(fetchPrivateData(account))
      dispatch(fetchPendingReward(account))
    }
  }, [slowRefresh, account, dispatch])

  const lockAmount = useSelector((state: State) => state.longTerm.userLockAmount)
  const finixEarn = useSelector((state: State) => state.longTerm.finixEarn)
  return { lockAmount, finixEarn }
}

export const useAllLock = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
  const [balance, setBalanceOf] = useState(new BigNumber(0))


  useEffect(() => {
      dispatch(fetchAllLockPeriods())
  }, [slowRefresh, dispatch])

  const allLockPeriod = useSelector((state: State) => state.longTerm.allLockPeriods)
  return { allLockPeriod }
}

export const usePendingReward = () => {
  const { slowRefresh } = useRefresh()
  const [pendingReward, setPendingReward] = useState(new BigNumber(0))
  const { account } = useWallet()

  useEffect(() => {
    async function fetchBalance() {
      const vfinixearn = getContract(RewardFacet.abi, getVFinix())
      try {
        const res = await vfinixearn.methods.pendingReward(account).call()
        setPendingReward(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)))
      } catch (e) {
        setPendingReward(null)
      }
    }

    fetchBalance()
  }, [slowRefresh, account])

  return pendingReward
}

export const useAllowance = () => {
  const { slowRefresh } = useRefresh()
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account } = useWallet()

  useEffect(() => {
    async function fetchBalance() {
      const vfinixearn = getContract(IKIP7.abi, getFinixAddress())
      try {
        const res = await vfinixearn.methods.allowance(account, getVFinix()).call()
        setAllowance(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)))
      } catch (e) {
        setAllowance(null)
      }
    }

    fetchBalance()
  }, [slowRefresh, account])

  return allowance
}

export const useLocks = (startIndex) => {
  const { slowRefresh } = useRefresh()
  const [locks, setLocks] = useState([])
  const { account } = useWallet()

  const fetchBalance = useCallback(async () => {
    const lock = getContract(VaultFacet.abi, getVFinix())
    try {
      const allLockPeriod = await lock.methods.getAllLockPeriods().call()
      const res = await lock.methods.locks(account, startIndex, 10).call()

      const periodMap = {}
      let asMinutes = 0
      let asPenaltyMinutes = 0
      const penaltyRate = {}
      const periodMapPenalty = {}
      const lockss = []
      for (let i = 0; i < 3; i++) {
        _.set(periodMap, `${i}`, _.get(allLockPeriod, `_period${i + 1}`) * 1)
        _.set(periodMapPenalty, `${i}`, _.get(allLockPeriod, `_penaltyPeriod${i + 1}`) * 1)
        _.set(
          penaltyRate,
          `${i}`,
          Number(
            new BigNumber(_.get(allLockPeriod, `_penaltyRate${i + 1}`))
              .dividedBy(_.get(allLockPeriod, `_penaltyRateDecimal${i + 1}`))
              .toFixed(),
          ),
        )
      }
      if (periodMap) {
        res.map((value) => {
          const canBeUnlock_ = Math.floor(new Date().getTime() / 1000) - periodMap[value.level] > value.lockTimestamp
          const canBeClaim =
            Math.floor(new Date().getTime() / 1000) - periodMap[value.level] > value.penaltyUnlockTimestamp

          asMinutes = moment.duration({ seconds: periodMap[value.level] }).asMinutes()
          asPenaltyMinutes = moment.duration({ seconds: periodMapPenalty[value.level] }).asMinutes()

          let now = new Date(value.lockTimestamp * 1000)
          now.setMinutes(now.getMinutes() + asMinutes)
          now = new Date(now)

          let unLockTime = new Date(value.lockTimestamp * 1000)
          unLockTime.setMinutes(unLockTime.getMinutes() + asPenaltyMinutes)
          unLockTime = new Date(unLockTime)

          let penaltyTimestamp = new Date(value.penaltyUnlockTimestamp * 1000)
          penaltyTimestamp.setMinutes(penaltyTimestamp.getMinutes() + asPenaltyMinutes)
          penaltyTimestamp = new Date(penaltyTimestamp)

          let claim
          if (canBeClaim) {
            if (value.penaltyUnlockTimestamp !== 0) {
              claim = canBeClaim
            } else {
              claim = false
            }
          } else {
            claim = false
          }
          lockss.push({
            id: value.id,
            level: value.level,
            isUnlocked: value.isUnlocked,
            isPenalty: value.isPenalty,
            penaltyFinixAmount: value.penaltyFinixAmount,
            penaltyUnlockTimestamp: moment(penaltyTimestamp).format('DD-MM-YYYY HH:mm:ss'),
            // penaltyUnlockTimestamp: moment(unLockTime).format('DD-MM-YYYY HH:mm:ss'),
            canBeUnlock: canBeUnlock_,
            canBeClaim: claim,
            penaltyRate: penaltyRate[value.level],
            lockAmount: new BigNumber(value.lockAmount).dividedBy(new BigNumber(10).pow(18)).toNumber(),
            voteAmount: new BigNumber(value.lockAmount).dividedBy(new BigNumber(10).pow(18)).toNumber(),
            lockTimestamp: moment(now).format('DD-MM-YYYY HH:mm:ss'),
            periodPenalty: moment(unLockTime).format('DD-MM-YYYY HH:mm:ss'),
          })
          return lockss
        })
      }
      setLocks(lockss)
    } catch (e) {
      setLocks(null)
    }
  }, [account, startIndex])

  useEffect(() => {
    fetchBalance()
  }, [slowRefresh, account, fetchBalance])

  return { locks, fetchBalance }
}

export const useAllLockPeriods = () => {
  const { slowRefresh } = useRefresh()
  const [locks, setLocks] = useState([])
  const { account } = useWallet()

  useEffect(() => {
    async function fetchBalance() {
      const lock = getContract(VaultFacet.abi, getVFinix())
      try {
        const allLockPeriod = await lock.methods.getAllLockPeriods().call()
        const arrLocks = []
        arrLocks.push({
          multiplier1_: allLockPeriod._multiplier1 / 10,
          multiplier2_: allLockPeriod._multiplier2 / 10,
          multiplier3_: allLockPeriod._multiplier3 / 10,
          period1_: allLockPeriod._period1,
          period2_: allLockPeriod._period2,
          period3_: allLockPeriod._period3,
          _minimum1: allLockPeriod._minimum1,
          _minimum2: allLockPeriod._minimum2,
          _minimum3: allLockPeriod._minimum3,
        })
        setLocks(arrLocks)
      } catch (e) {
        setLocks(null)
      }
    }

    fetchBalance()
  }, [slowRefresh, account])

  return locks
}

const handleContractExecute = (_executeFunction, _account) => {
  return new Promise((resolve, reject) => {
    _executeFunction.estimateGas({ from: _account }).then((estimatedGasLimit) => {
      _executeFunction.send({ from: _account, gas: estimatedGasLimit }).then(resolve).catch(reject)
    })
  })
}

export const useUnLock = () => {
  const { account } = useWallet()

  const onUnLock = async (id) => {
    const lock = getContract(VaultFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(lock.methods.unlock(id), account).then(resolve).catch(reject)
    })
  }

  return { unnLock: onUnLock }
}

export const useLock = (level, lockFinix, focus) => {
  const [status, setStatus] = useState(false)
  const { account } = useWallet()

  const stake = async () => {
    const lock = getContract(VaultFacet.abi, getVFinix())
    setStatus(false)
    if (lockFinix) {
      try {
        await lock.methods
          .lock(level, lockFinix)
          .estimateGas({ from: account })
          .then((estimatedGasLimit) => {
            lock.methods
              .lock(level, lockFinix)
              .send({ from: account, gas: estimatedGasLimit })
              .then((resolve) => {
                setStatus(resolve.status)
              })
              .catch((e) => {
                console.log(e)
              })
          })
      } catch (e) {
        setStatus(false)
      }
    } else {
      setStatus(false)
    }
    return status
  }

  return { onStake: stake, status }
}

export const useHarvest = () => {
  const { account } = useWallet()

  const handleHarvest = useCallback(async () => {
    const reward = getContract(RewardFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(reward.methods.harvest(account), account).then(resolve).catch(reject)
    })
  }, [account])

  return { handleHarvest }
}

export const useApprove = (max) => {
  const { account } = useWallet()

  const onApprove = useCallback(async () => {
    const reward = getContract(IKIP7.abi, getFinixAddress())
    return new Promise((resolve, reject) => {
      handleContractExecute(reward.methods.approve(getVFinix(), max), account).then(resolve).catch(reject)
    })
  }, [account, max])

  return { onApprove }
}

export const useLockCount = () => {
  const { slowRefresh } = useRefresh()
  const [balance, setBalanceOf] = useState(0)
  const { account } = useWallet()

  useEffect(() => {
    async function fetchLockCount() {
      const finixBalance = getContract(VaultFacet.abi, getVFinix())
      try {
        const res = await finixBalance.methods.lockCount(account).call()
        setBalanceOf(res)
      } catch (e) {
        setBalanceOf(null)
      }
    }

    fetchLockCount()
  }, [slowRefresh, account])

  return balance
}

export const useUnstakeId = () => {
  const id = useSelector((state: State) => {
    return state.longTerm.id
  })

  const level = useSelector((state: State) => {
    return state.longTerm.level
  })

  const amount = useSelector((state: State) => {
    return state.longTerm.amount
  })

  const isPenalty = useSelector((state: State) => {
    return state.longTerm.isPenalty
  })

  const canBeUnlock = useSelector((state: State) => {
    return state.longTerm.canBeUnlock
  })

  const penaltyRate = useSelector((state: State) => {
    return state.longTerm.penaltyRate
  })

  const periodPenalty = useSelector((state: State) => {
    return state.longTerm.periodPenalty
  })

  const totalFinixLock = useSelector((state: State) => {
    return state.longTerm.totalFinixLock
  })

  const totalvFinixSupply = useSelector((state: State) => {
    return state.longTerm.totalvFinixSupply
  })

  const finixLockMap = useSelector((state: State) => {
    return state.longTerm.finixLockMap
  })

  // const lockAmount = useSelector((state: State) => {
  //   return state.longTerm.lockAmount
  // })

  return {
    id,
    level,
    amount,
    isPenalty,
    canBeUnlock,
    penaltyRate,
    periodPenalty,
    totalFinixLock,
    totalvFinixSupply,
    finixLockMap,
    // lockAmount
  }
}

export const useClaim = () => {
  const { account } = useWallet()

  const handleClaim = async (id) => {
    const lock = getContract(VaultPenaltyFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(lock.methods.claimWithPenalty(id), account).then(resolve).catch(reject)
    })
  }

  return { onClaim: handleClaim }
}

export default useLongTermStake
