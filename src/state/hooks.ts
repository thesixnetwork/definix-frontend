import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWallet } from '@binance-chain/bsc-use-wallet'
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

export const usePriceBnbBusd = (): BigNumber => {
  // const pid = 5 // BUSD-BNB LP
  const pid = parseInt(process.env.REACT_APP_SIX_BUSD_PID, 10) // BUSD-SIX LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(1).div(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceSixBusd = (): BigNumber => {
  // const pid = 5 // BUSD-BNB LP
  const pid = parseInt(process.env.REACT_APP_SIX_BUSD_PID, 10) // BUSD-SIX LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(1).div(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceFinixBusd = (): BigNumber => {
  // const pid = 1 // FINIX-BNB LP
  const pid = parseInt(process.env.REACT_APP_FINIX_BUSD_PID, 10) // FINIX-BUSD LP
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
  const selectedPools = pools.find((pool) => pool.sousId === 1)
  const sixFinixQuote = useSelector((state: State) => state.finixPrice.sixFinixQuote)
  const sixBusdQuote = useSelector((state: State) => state.finixPrice.sixBusdQuote)
  const sixUsdtQuote = useSelector((state: State) => state.finixPrice.sixUsdtQuote)
  const sixWbnbQuote = useSelector((state: State) => state.finixPrice.sixWbnbQuote)
  const finixBusdQuote = useSelector((state: State) => state.finixPrice.finixBusdQuote)
  const finixUsdtQuote = useSelector((state: State) => state.finixPrice.finixUsdtQuote)
  const finixWbnbQuote = useSelector((state: State) => state.finixPrice.finixWbnbQuote)
  const wbnbBusdQuote = useSelector((state: State) => state.finixPrice.wbnbBusdQuote)
  const wbnbUsdtQuote = useSelector((state: State) => state.finixPrice.wbnbUsdtQuote)
  const busdUsdtQuote = useSelector((state: State) => state.finixPrice.busdUsdtQuote)
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
    const sixFinixPrice = new BigNumber(sixFinixQuote).times(finixUsdPrice)
    const sixBusdPrice = new BigNumber(sixBusdQuote)
    const sixUsdtPrice = new BigNumber(sixUsdtQuote)
    const sixWbnbPrice = new BigNumber(sixWbnbQuote).times(finixUsdPrice)
    const finixBusdPrice = new BigNumber(finixBusdQuote)
    const finixUsdtPrice = new BigNumber(finixUsdtQuote)
    const finixWbnbPrice = new BigNumber(finixWbnbQuote).times(finixUsdPrice)
    const wbnbBusdPrice = new BigNumber(wbnbBusdQuote)
    const wbnbUsdtPrice = new BigNumber(wbnbUsdtQuote)
    const busdUsdtPrice = new BigNumber(busdUsdtQuote)
    return BigNumber.sum.apply(null, [
      sixFinixPrice,
      sixBusdPrice,
      sixUsdtPrice,
      sixWbnbPrice,
      finixBusdPrice,
      finixUsdtPrice,
      finixWbnbPrice,
      wbnbBusdPrice,
      wbnbUsdtPrice,
      busdUsdtPrice,
      totalStaked.times(sixUsd).toNumber(),
    ])
  }
}

export const usePriceEthBusd = (): BigNumber => {
  // const pid = 6 // ETH-BNB LP
  const pid = 10 // ETH-BNB LP
  const bnbPriceUSD = usePriceBnbBusd()
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? bnbPriceUSD.times(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceEthBnb = (): BigNumber => {
  const priceBnbBusd = usePriceBnbBusd()
  const priceEthBusd = usePriceEthBusd()
  return priceEthBusd.div(priceBnbBusd)
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
