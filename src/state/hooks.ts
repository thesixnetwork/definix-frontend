import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Toast, toastTypes } from 'uikit-dev'
import { Toast as ToastG2, toastTypes as toastTypesG2 } from 'uikitV2/Toast'
import { getAddress } from 'utils/addressHelpers'
import { useSelector, useDispatch } from 'react-redux'
import { Team } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import {
  fetchFarmUnlockDate,
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchFinixPrice,
  fetchPancakeBnbPrice,
  fetchSixPrice,
  fetchTVL,
  fetchRebalances,
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
} from './actions'
import { Balances, State, Farm, Rebalance, Pool, ProfileState, TeamsState, AchievementState } from './types'
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
    dispatch(fetchTVL())
    dispatch(fetchPancakeBnbPrice())
    dispatch(fetchRebalances())
  }, [dispatch, slowRefresh])
}

// Farms

export const useSlippage = (): number => {
  const slippage = useSelector((state: State) => state.wallet.userSlippage)
  return slippage
}

export const useRebalanceBalances = (account: string): Balances => {
  const rebalanceBalances = useSelector((state: State) => state.wallet.userRebalanceBalances[account])
  return rebalanceBalances
}

export const useRebalanceRewards = (account: string): Balances => {
  const rebalanceReward = useSelector((state: State) => state.wallet.userRebalanceReward[account])
  return rebalanceReward
}

export const useBalances = (account: string): Balances => {
  const balances = useSelector((state: State) => state.wallet.balances[account])
  return balances
}

export const useDecimals = (account: string): Balances => {
  const decimals = useSelector((state: State) => state.wallet.decimals[account])
  return decimals
}

export const useAllowances = (account: string, spender: string): Balances | undefined => {
  const allowances = useSelector((state: State) => state.wallet.allowances[account])
  return (allowances || {})[spender]
}

export const useFarmUnlockDate = (): Date => {
  const unlockDate = useSelector((state: State) => state.farms.farmUnlockAt)
  return unlockDate
}

export const useWalletRebalanceFetched = (): boolean => {
  const isFetched = useSelector((state: State) => state.wallet.isRebalanceFetched)
  return isFetched
}

export const useWalletFetched = (): boolean => {
  const isFetched = useSelector((state: State) => state.wallet.isFetched)
  return isFetched
}

export const usePoolsIsFetched = (): boolean => {
  const isFetched = useSelector((state: State) => state.pools.isFetched)
  return isFetched
}

export const usePoolVeloIsFetched = (): boolean => {
  const isFetched = useSelector((state: State) => state.pools.isFetched)
  return isFetched
}

export const useRebalancesIsFetched = (): boolean => {
  const isFetched = useSelector((state: State) => state.rebalances.isFetched)
  return isFetched
}

export const useRebalanceAddress = (address): Rebalance => {
  const rebalance = useSelector((state: State) => state.rebalances.data.find((f) => getAddress(f.address) === address))
  return rebalance
}

export const useRebalances = (): Rebalance[] => {
  const rebalances = useSelector((state: State) => state.rebalances.data)
  return rebalances
}

export const useFarmsIsFetched = (): boolean => {
  const isFetched = useSelector((state: State) => state.farms.isFetched)
  return isFetched
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
  const pid = parseInt(process.env.REACT_APP_BNB_BUSD_PID || '7', 10) // BUSD-SIX LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceSixBusd = (): BigNumber => {
  // const pid = 5 // BUSD-BNB LP
  const pid = parseInt(process.env.REACT_APP_SIX_BUSD_PID || '4', 10) // BUSD-SIX LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceFinixBusd = (): BigNumber => {
  // const pid = 1 // FINIX-BNB LP
  const pid = parseInt(process.env.REACT_APP_FINIX_BUSD_PID || '2', 10) // FINIX-BUSD LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePricePancakeBnbUsd = (): BigNumber => {
  const pancakeBnbPrice = useSelector((state: State) => state.finixPrice.pancakeBnbPrice)
  return new BigNumber(pancakeBnbPrice)
}

export const usePriceFinixUsd = (): BigNumber => {
  const finixPrice = useSelector((state: State) => state.finixPrice.price)
  return new BigNumber(finixPrice)
}

export const usePriceSixUsd = (): BigNumber => {
  const sixPrice = useSelector((state: State) => state.finixPrice.sixPrice)
  return new BigNumber(sixPrice)
}

export const usePriceCaverTVL = (): BigNumber => {
  const caverTVL = useSelector((state: State) => state.finixPrice.caverTVL)
  return new BigNumber(caverTVL)
}

export const usePriceTVL = (): BigNumber => {
  const web3TVL = useSelector((state: State) => state.finixPrice.web3TVL)
  return new BigNumber(web3TVL)
}

export const usePriceEthBusd = (): BigNumber => {
  // const pid = 6 // ETH-BNB LP
  const pid = parseInt(process.env.REACT_APP_ETH_BNB_PID || '9', 10) // BUSD-SIX LP
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
// Toasts
export const useToastG2 = () => {
  const dispatch = useDispatch()
  const helpers = useMemo(() => {
    const push = (toast: ToastG2) => dispatch(pushToast(toast))

    return {
      toastError: (title: string, description?: any) => {
        return push({ id: new Date().toString(), type: toastTypesG2.DANGER, title, description })
      },
      toastInfo: (title: string, description?: any) => {
        return push({ id: new Date().toString(), type: toastTypesG2.INFO, title, description })
      },
      toastSuccess: (title: string, description?: any) => {
        return push({ id: new Date().toString(), type: toastTypesG2.SUCCESS, title, description })
      },
      toastWarning: (title: string, description?: any) => {
        return push({ id: new Date().toString(), type: toastTypesG2.WARNING, title, description })
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
