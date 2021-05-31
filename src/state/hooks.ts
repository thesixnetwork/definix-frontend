import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWallet } from 'klaytn-use-wallet'
import { Toast, toastTypes } from 'uikit-dev'
import { useSelector, useDispatch } from 'react-redux'
import { Team } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import {
  fetchFarmUnlockDate,
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchFinixPrice,
  fetchKlayPriceFromKlayswap,
  fetchDefinixKlayPrice,
  fetchSixPrice,
  fetchQuote,
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
} from './actions'
import { State, Farm, Pool, ProfileState, TeamsState, AchievementState } from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchFarmUnlockDate())
    dispatch(fetchPoolsPublicDataAsync())
    dispatch(fetchFinixPrice())
    dispatch(fetchSixPrice())
    dispatch(fetchKlayPriceFromKlayswap())
    dispatch(fetchDefinixKlayPrice())
    dispatch(fetchQuote())
  }, [dispatch, slowRefresh])
}

// Farms

export const useFarmUnlockDate = (): Date => {
  const unlockDate = useSelector((state: State) => state.farms.farmUnlockAt)
  return unlockDate
}

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Prices
export const usePriceKlayKusdt = (): BigNumber => {
  // const pid = 5 // KLAY-KUSDT LP
  const pid = parseInt(process.env.REACT_APP_KLAY_KUSDT_PID, 10) // KLAY-KUSDT LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(1).div(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceSixKusdt = (): BigNumber => {
  // const pid = 5 // SIX-KUSDT LP
  const pid = parseInt(process.env.REACT_APP_SIX_KUSDT_PID, 10) // SIX-KUSDT LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(1).div(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceFinixKusdt = (): BigNumber => {
  // const pid = 1 // FINIX-KUSDT LP
  const pid = parseInt(process.env.REACT_APP_FINIX_KUSDT_PID, 10) // FINIX-KUSDT LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(1).div(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceKethKusdt = (): BigNumber => {
  // const pid = 6 // ETH-KUSDT LP
  const pid = parseInt(process.env.REACT_APP_KETH_KUSDT_PID, 10) // KETH-KUSDT LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(1).div(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceFinixUsd = (): BigNumber => {
  const finixPrice = useSelector((state: State) => state.finixPrice.price)
  return new BigNumber(finixPrice)
}

export const usePriceSixUsd = (): BigNumber => {
  const sixPrice = useSelector((state: State) => state.finixPrice.sixPrice)
  return new BigNumber(sixPrice)
}

export const usePriceTVL = (): BigNumber => {
  const { account } = useWallet()
  const pools = usePools(account)
  const sixUsd = usePriceSixUsd()
  // const pancakeBnbPrice = usePricePancakeBnbUsd()
  const selectedPools = pools.find((pool) => pool.sousId === 6) || { totalStaked: new BigNumber(0), tokenDecimals: 18 }
  const selectedPoolsFinixFinix = pools.find((pool) => pool.sousId === 0) || {
    totalStaked: new BigNumber(0),
    tokenDecimals: 18,
  }
  const selectedPoolsSixFinix = pools.find((pool) => pool.sousId === 1) || {
    totalStaked: new BigNumber(0),
    tokenDecimals: 18,
  }
  const sixFinixQuote = useSelector((state: State) => state.finixPrice.sixFinixQuote)
  const sixKusdtQuote = useSelector((state: State) => state.finixPrice.sixKusdtQuote)
  const sixWklayQuote = useSelector((state: State) => state.finixPrice.sixWklayQuote)
  const finixKusdtQuote = useSelector((state: State) => state.finixPrice.finixKusdtQuote)
  const finixWklayQuote = useSelector((state: State) => state.finixPrice.finixWklayQuote)
  const wklayKusdtQuote = useSelector((state: State) => state.finixPrice.wklayKusdtQuote)
  const kdaiKusdtQuote = useSelector((state: State) => state.finixPrice.kdaiKusdtQuote)
  const finixUsdPrice = usePriceFinixUsd()
  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()
  if (currentTime < phrase2TimeStamp) {
    let totalStaked = new BigNumber(0)
    switch (typeof selectedPools.totalStaked) {
      case 'undefined':
        totalStaked = new BigNumber(0)
        break
      case 'string':
        totalStaked = new BigNumber((parseFloat(selectedPools.totalStaked) || 0) / 10 ** selectedPools.tokenDecimals)
        break
      default:
        totalStaked = selectedPools.totalStaked.times(new BigNumber(10).pow(18))
        break
    }
    return totalStaked.times(sixUsd)
    // eslint-disable-next-line
  } else {
    let totalStaked = new BigNumber(0)
    switch (typeof selectedPools.totalStaked) {
      case 'undefined':
        totalStaked = new BigNumber(0)
        break
      case 'string':
        totalStaked = new BigNumber((parseFloat(selectedPools.totalStaked) || 0) / 10 ** selectedPools.tokenDecimals)
        break
      default:
        totalStaked = selectedPools.totalStaked.times(new BigNumber(10).pow(18))
        break
    }
    let totalStakedFinixFinix = new BigNumber(0)
    switch (typeof selectedPoolsFinixFinix.totalStaked) {
      case 'undefined':
        totalStakedFinixFinix = new BigNumber(0)
        break
      case 'string':
        totalStakedFinixFinix = new BigNumber(
          (parseFloat(selectedPoolsFinixFinix.totalStaked) || 0) / 10 ** selectedPoolsFinixFinix.tokenDecimals,
        )
        break
      default:
        totalStakedFinixFinix = selectedPoolsFinixFinix.totalStaked.times(new BigNumber(10).pow(18))
        break
    }
    let totalStakedSixFinix = new BigNumber(0)
    switch (typeof selectedPoolsSixFinix.totalStaked) {
      case 'undefined':
        totalStakedSixFinix = new BigNumber(0)
        break
      case 'string':
        totalStakedSixFinix = new BigNumber(
          (parseFloat(selectedPoolsSixFinix.totalStaked) || 0) / 10 ** selectedPoolsSixFinix.tokenDecimals,
        )
        break
      default:
        totalStakedSixFinix = selectedPoolsSixFinix.totalStaked.times(new BigNumber(10).pow(18))
        break
    }
    const wklayKusdtPrice = new BigNumber(wklayKusdtQuote)
    const sixFinixPrice = new BigNumber(sixFinixQuote).times(finixUsdPrice)
    const sixKusdtPrice = new BigNumber(sixKusdtQuote)
    const sixWklayPrice = new BigNumber(sixWklayQuote).times(wklayKusdtPrice)
    const finixKusdtPrice = new BigNumber(finixKusdtQuote)
    const finixWklayPrice = new BigNumber(finixWklayQuote).times(finixUsdPrice)
    const kdaiKusdtPrice = new BigNumber(kdaiKusdtQuote)
    return BigNumber.sum.apply(null, [
      sixFinixPrice,
      sixKusdtPrice,
      sixWklayPrice,
      finixKusdtPrice,
      finixWklayPrice,
      wklayKusdtPrice,
      kdaiKusdtPrice,
      totalStaked.times(sixUsd).toNumber(),
      totalStakedFinixFinix.times(finixUsdPrice).toNumber(),
      totalStakedSixFinix.times(sixUsd).toNumber(),
    ])
  }
}

export const usePriceKethKlay = (): BigNumber => {
  const priceKlayKusdt = usePriceKlayKusdt()
  const priceKethKusdt = usePriceKethKusdt()
  return priceKethKusdt.div(priceKlayKusdt)
}

// Toasts
export const useToast = () => {
  const dispatch = useDispatch()
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast))

    return {
      toastError: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.DANGER, title, description })
      },
      toastInfo: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.INFO, title, description })
      },
      toastSuccess: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.SUCCESS, title, description })
      },
      toastWarning: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.WARNING, title, description })
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// Profile

export const useFetchProfile = () => {
  const { account } = useWallet()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeam(id))
  }, [id, dispatch])

  return team
}

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  return { teams: data, isInitialized, isLoading }
}

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWallet()
  const dispatch = useDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}
