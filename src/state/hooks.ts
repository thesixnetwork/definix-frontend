import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Toast, toastTypes } from 'uikit-dev'
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
  fetchKlayPriceFromKlayswap,
  fetchDefinixKlayPrice,
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
    dispatch(fetchKlayPriceFromKlayswap())
    dispatch(fetchDefinixKlayPrice())
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

export const usePoolsIsFetched = (): boolean => {
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
    pendingRewards: farm.userData ? farm.userData.pendingRewards : [],
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
  const pid = parseInt(process.env.REACT_APP_KLAY_KUSDT_PID || '14') // KLAY-KUSDT LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceSixKusdt = (): BigNumber => {
  const sixPrice = useSelector((state: State) => state.finixPrice.sixPrice)
  return new BigNumber(sixPrice)
}

export const usePriceFinixKusdt = (): BigNumber => {
  // const pid = 1 // FINIX-KUSDT LP
  const pid = parseInt(process.env.REACT_APP_FINIX_KUSDT_PID || '5') // FINIX-KUSDT LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceKethKusdt = (): BigNumber => {
  // const pid = 6 // ETH-KUSDT LP
  const pid = parseInt(process.env.REACT_APP_KETH_KUSDT_PID || '11') // KETH-KUSDT LP
  const farm = useFarmFromPid(pid)
  if (!farm) return ZERO
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceFinixUsd = (): BigNumber => {
  const finixPrice = useSelector((state: State) => state.finixPrice.price)
  return new BigNumber(finixPrice)
}

export const usePriceSixUsd = (): BigNumber => {
  const sixPrice = useSelector((state: State) => state.finixPrice.sixPrice)
  return new BigNumber(sixPrice)
}

export const usePriceKlayUsd = (): BigNumber => {
  const definixKlayPrice = useSelector((state: State) => state.finixPrice.definixKlayPrice)
  return new BigNumber(definixKlayPrice)
}

export const usePriceWeb3TVL = (): BigNumber => {
  const web3TVL = useSelector((state: State) => state.finixPrice.web3TVL)
  return new BigNumber(web3TVL)
}

export const usePriceTVL = (): BigNumber => {
  const caverTVL = useSelector((state: State) => state.finixPrice.caverTVL)
  return new BigNumber(caverTVL)
}

export const usePriceKethKlay = (): BigNumber => {
  const priceKlayKusdt = usePriceKlayUsd()
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
