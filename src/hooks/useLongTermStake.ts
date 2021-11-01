/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import moment from 'moment'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { provider } from 'web3-core'
import { getAddress } from 'utils/addressHelpers'
import {
  getAbiERC20ByName,
  getAbiVaultPenaltyFacetByName,
  getAbiVaultFacetByName,
  getAbiRewardFacetByName,
} from 'hooks/hookHelper'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import * as klipProvider from 'hooks/klipProvider'
import { fetchPrivateData, fetchPendingReward, fetchAllLockPeriods } from '../state/actions'
import VaultInfoFacet from '../config/abi/VaultInfoFacet.json'
import IKIP7 from '../config/abi/IKIP7.json'
import VaultFacet from '../config/abi/VaultFacet.json'
import RewardFacet from '../config/abi/RewardFacet.json'
import VaultPenaltyFacet from '../config/abi/VaultPenaltyFacet.json'
import multicall from '../utils/multicall'
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
  const { fastRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<string>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const finixContract = getContract(IKIP7.abi, getVFinix())
      const supply = await finixContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply).dividedBy(new BigNumber(10).pow(18)).toString())
    }

    fetchTotalSupply()
  }, [fastRefresh])

  return totalSupply
}

export const useTotalFinixLock = () => {
  const { fastRefresh } = useRefresh()
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
  }, [fastRefresh])

  return totalFinixLock
}

export const useBalances = () => {
  const { fastRefresh } = useRefresh()
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
  }, [fastRefresh, account])

  return balance
}

export const usePrivateData = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const [balance, setBalanceOf] = useState(new BigNumber(0))
  const { account } = useWallet()
  const startIndex = useSelector((state: State) => state.longTerm.startIndex)
  const allLockPeriod = useSelector((state: State) => state.longTerm.allLockPeriods)

  useEffect(() => {
    if (account) {
      dispatch(fetchPrivateData(account, startIndex, allLockPeriod))
      dispatch(fetchPendingReward(account))
    }
  }, [fastRefresh, account, dispatch, startIndex, allLockPeriod])

  const lockAmount = useSelector((state: State) => state.longTerm.userLockAmount)
  const finixEarn = useSelector((state: State) => state.longTerm.finixEarn)
  const allDataLock = useSelector((state: State) => state.longTerm.allDataLock)
  const balancefinix = useSelector((state: State) => state.longTerm.balanceFinix)
  const balancevfinix = useSelector((state: State) => state.longTerm.balancevFinix)
  return { lockAmount, finixEarn, startIndex, allDataLock, balancefinix, balancevfinix }
}

export const useAllLock = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const [balance, setBalanceOf] = useState(new BigNumber(0))

  useEffect(() => {
    dispatch(fetchAllLockPeriods())
  }, [fastRefresh, dispatch])

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

const handleContractExecute = (_executeFunction, _account) => {
  return new Promise((resolve, reject) => {
    _executeFunction.estimateGas({ from: _account }).then((estimatedGasLimit) => {
      _executeFunction.send({ from: _account, gas: estimatedGasLimit }).then(resolve).catch(reject)
    })
  })
}

export const useUnLock = () => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const onUnLock = async (id) => {
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getVFinix(),
        JSON.stringify(getAbiVaultFacetByName('unlock')),
        JSON.stringify([id]),
        setShowModal,
      )
      await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve, reject) => {
        resolve('')
      })
    }
    const lock = getContract(VaultFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(lock.methods.unlock(id), account).then(resolve).catch(reject)
    })
  }

  return { unnLock: onUnLock }
}

export const useLock = (level, lockFinix, focus) => {
  const [status, setStatus] = useState(false)
  const [loadings, setLoading] = useState('')
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const stake = useCallback(async () => {
    setStatus(false)
    setLoading('loading')
    if (lockFinix) {
      try {
        if (connector === 'klip') {
          klipProvider.genQRcodeContactInteract(
            getVFinix(),
            JSON.stringify(getAbiVaultFacetByName('lock')),
            JSON.stringify([level, lockFinix]),
            setShowModal,
          )
          await klipProvider.checkResponse()
          setShowModal(false)
          setLoading('success')
          setStatus(true)
          setInterval(() => setLoading(''), 5000)
          setInterval(() => setStatus(false), 5000)
        } else {
          const lock = getContract(VaultFacet.abi, getVFinix())
          await lock.methods
            .lock(level, lockFinix)
            .estimateGas({ from: account })
            .then((estimatedGasLimit) => {
              lock.methods
                .lock(level, lockFinix)
                .send({ from: account, gas: estimatedGasLimit })
                .then((resolve) => {
                  setLoading('success')
                  setStatus(true)
                  setInterval(() => setLoading(''), 5000)
                  setInterval(() => setStatus(false), 5000)
                })
                .catch((e) => {
                  setLoading('')
                  setStatus(false)
                })
            })
        }
      } catch (e) {
        setStatus(false)
      }
    } else {
      setStatus(false)
    }

    return status
  }, [account, level, lockFinix, status, connector, setShowModal])

  return { onStake: stake, status, loadings }
}

export const useHarvest = () => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const handleHarvest = useCallback(async () => {
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getVFinix(),
        JSON.stringify(getAbiRewardFacetByName('harvest')),
        JSON.stringify([account]),
        setShowModal,
      )
      await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve, reject) => {
        resolve('ok')
      })
    }
    const reward = getContract(RewardFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(reward.methods.harvest(account), account).then(resolve).catch(reject)
    })
  }, [account, connector, setShowModal])

  return { handleHarvest }
}

export const useApprove = (max) => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const onApprove = useCallback(async () => {
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getFinixAddress(),
        JSON.stringify(getAbiERC20ByName('approve')),
        JSON.stringify([getVFinix(), klipProvider.MAX_UINT_256_KLIP]),
        setShowModal,
      )
      const txHash = await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve, reject) => {
        resolve(txHash)
      })
    }
    const reward = getContract(IKIP7.abi, getFinixAddress())
    return new Promise((resolve, reject) => {
      handleContractExecute(reward.methods.approve(getVFinix(), max), account).then(resolve).catch(reject)
    })
  }, [account, max, connector, setShowModal])

  return { onApprove }
}
export const useAprCardFarmHome = () => {
  const { account } = useWallet()
  const { slowRefresh } = useRefresh()
  const [apr, setApr] = useState<number>()

  useEffect(() => {
    async function fetchApr() {
      const rewardFacetContract = getContract(RewardFacet.abi, getVFinix())
      const finixContract = getContract(IKIP7.abi, getVFinix())
      const userVfinixInfoContract = getContract(VaultInfoFacet.abi, getVFinix())

      const [rewardPerBlockNumber, totalSupplyNumber, userVfinixAmount] = await Promise.all([
        await rewardFacetContract.methods.rewardPerBlock().call(),
        await finixContract.methods.totalSupply().call(),
        await userVfinixInfoContract.methods.locks(account, 0, 0).call(),
      ])
      const rewardPerBlock = new BigNumber(rewardPerBlockNumber).multipliedBy(86400).multipliedBy(365)
      const totalSupply = new BigNumber(totalSupplyNumber)

      let totalVfinixUser = new BigNumber(0)
      let totalfinixUser = new BigNumber(0)
      for (let i = 0; i < userVfinixAmount.length; i++) {
        const selector = userVfinixAmount[i]
        if (selector.isUnlocked === false && selector.isPenalty === false) {
          totalVfinixUser = totalVfinixUser.plus(selector.voteAmount)
          totalfinixUser = totalfinixUser.plus(selector.lockAmount)
        }
      }

      const aprUser = totalVfinixUser
        .dividedBy(totalSupply)
        .multipliedBy(rewardPerBlock)
        .dividedBy(totalfinixUser)
        .multipliedBy(100)
      // locks
      setApr(aprUser.toNumber())
    }

    fetchApr()
  }, [slowRefresh, account])

  return apr
}
export const useApr = () => {
  // const { account } = useWallet()
  const { slowRefresh } = useRefresh()
  const [apr, setApr] = useState<number>()

  useEffect(() => {
    async function fetchApr() {
      const finixLock = getContract(RewardFacet.abi, getVFinix())
      const finixContract = getContract(IKIP7.abi, getVFinix())
      // const userVfinixInfoContract = getContract(VaultInfoFacet.abi, getVFinix())
      const supply = await finixLock.methods.rewardPerBlock().call()
      const total = await finixContract.methods.totalSupply().call()
      const totalSupply = new BigNumber(total).dividedBy(new BigNumber(10).pow(18)).toNumber()
      const reward = new BigNumber(supply).dividedBy(new BigNumber(10).pow(18)).toNumber()
      setApr(((reward * 86400 * 365) / Number(totalSupply)) * 100)
      // const [rewardPerBlockNumber, totalSupplyNumber, userVfinixAmount] = await Promise.all([
      //   await rewardFacetContract.methods.rewardPerBlock().call(),
      //   await finixContract.methods.totalSupply().call(),
      //   await userVfinixInfoContract.methods.locks(account, 0, 0).call(),
      // ])
      // const rewardPerBlock = new BigNumber(rewardPerBlockNumber).multipliedBy(86400).multipliedBy(365)
      // const totalSupply = new BigNumber(totalSupplyNumber)

      // let totalVfinixUser = new BigNumber(0)
      // let totalfinixUser = new BigNumber(0)
      // for (let i = 0; i < userVfinixAmount.length; i++) {
      //   const selector = userVfinixAmount[i]
      //   if (selector.isUnlocked === false && selector.isPenalty === false) {
      //     totalVfinixUser = totalVfinixUser.plus(selector.voteAmount)
      //     totalfinixUser = totalfinixUser.plus(selector.lockAmount)
      //   }
      // }

      // const aprUser = totalVfinixUser
      //   .dividedBy(totalSupply)
      //   .multipliedBy(rewardPerBlock)
      //   .dividedBy(totalfinixUser)
      //   .multipliedBy(100)
      // // locks
      // setApr(aprUser.toNumber())
    }

    fetchApr()
  }, [slowRefresh])

  return apr
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

  const totalSupplyAllTimeMint = useSelector((state: State) => {
    return state.longTerm.totalSupplyAllTimeMint
  })
  const multiplier = useSelector((state: State) => {
    return state.longTerm.multiplier
  })
  const days = useSelector((state: State) => {
    return state.longTerm.days
  })

  const vFinixPrice = useSelector((state: State) => {
    return state.longTerm.vFinixPrice
  })

  const lockCount = useSelector((state: State) => {
    return state.longTerm.lockCount
  })

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
    totalSupplyAllTimeMint,
    multiplier,
    days,
    vFinixPrice,
    lockCount,
    // lockAmount
  }
}

export const useClaim = () => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const handleClaim = async (id) => {
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getVFinix(),
        JSON.stringify(getAbiVaultPenaltyFacetByName('claimWithPenalty')),
        JSON.stringify([id]),
        setShowModal,
      )
      const txHash = await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve, reject) => {
        resolve(txHash)
      })
    }
    const lock = getContract(VaultPenaltyFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(lock.methods.claimWithPenalty(id), account).then(resolve).catch(reject)
    })
  }

  return { onClaim: handleClaim }
}

export default useLongTermStake
