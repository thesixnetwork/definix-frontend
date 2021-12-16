import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { provider } from 'web3-core'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import useFarmsList from 'hooks/useFarmsList'
import usePoolsList from 'hooks/usePoolsList'
import useConverter from 'hooks/useConverter'
import { useLockCount, useAllowance, usePrivateData, useAprCardFarmHome } from 'hooks/useLongTermStake'
import { fetchFarmUserDataAsync } from 'state/actions'
import { fetchBalances, fetchRebalanceBalances } from 'state/wallet'
import { useBalances, useRebalances, useRebalanceBalances, useFarms, usePools } from 'state/hooks'
import { getAddress } from 'utils/addressHelpers'

const useMyInvestments = () => {
  const { t } = useTranslation()
  const { account }: { account: string; klaytn: provider } = useWallet()
  const { convertToPriceFromToken, convertToPriceFromSymbol } = useConverter()
  const dispatch = useDispatch()
  const balances = useBalances(account)

  // Net Worth
  const getNetWorth = (d) => {
    // long term stake
    if (typeof d.lpSymbol === 'string' && d.lpSymbol === 'longTermStake') {
      return d.value
    }
    if (typeof d.ratio === 'object') {
      // rebalance
      const thisBalance = d.enableAutoCompound ? rebalanceBalances : balances
      const currentBalance = _.get(thisBalance, getAddress(d.address), new BigNumber(0))
      return currentBalance.times(d.sharedPrice || new BigNumber(0))
    }
    if (typeof d.pid === 'number') {
      // farm
      const stakedBalance = _.get(d, 'userData.stakedBalance', new BigNumber(0))
      const ratio = new BigNumber(stakedBalance).div(new BigNumber(d.lpTotalSupply))
      const stakedTotalInQuoteToken = new BigNumber(d.quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(d.quoteTokenDecimals))
        .times(ratio)
        .times(new BigNumber(2))
      // const displayBalance = rawStakedBalance.toLocaleString()
      let totalValue
      if (!d.lpTotalInQuoteToken) {
        totalValue = new BigNumber(0)
      } else {
        totalValue = convertToPriceFromToken(stakedTotalInQuoteToken, d.quoteTokenSymbol)
      }

      const earningRaw = _.get(d, 'userData.earnings', 0)
      const earning = new BigNumber(earningRaw).div(new BigNumber(10).pow(18))
      const totalEarning = convertToPriceFromToken(earning, 'finix')
      return new BigNumber(totalValue).plus(totalEarning)
    }
    if (typeof d.sousId === 'number') {
      // pool
      const stakedBalance = _.get(d, 'userData.stakedBalance', new BigNumber(0))
      const stakedTotal = new BigNumber(stakedBalance).div(new BigNumber(10).pow(18))
      const totalValue = convertToPriceFromToken(stakedTotal, d.stakingTokenName)
      const earningRaw = _.get(d, 'userData.pendingReward', 0)
      const earning = new BigNumber(earningRaw).div(new BigNumber(10).pow(18))
      const totalEarning = convertToPriceFromToken(earning, 'finix')
      return new BigNumber(totalValue).plus(totalEarning)
    }
    return new BigNumber(0)
  }

  // farms
  const farms = useFarms()
  const farmsWithApy = useFarmsList(farms)
  const stakedFarms = useMemo(() => {
    return farmsWithApy.reduce((result, farm) => {
      let arr = result
      if (farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)) {
        arr = [
          ...result,
          {
            label: t('Farm'),
            type: 'farm',
            data: farm,
          },
        ]
      }
      return arr
    }, [])
  }, [t, farmsWithApy])

  // pools
  const pools = usePools(account)
  const poolsWithApy = usePoolsList({ farms, pools })
  const stakedPools = useMemo(() => {
    return poolsWithApy.reduce((result, pool) => {
      let arr = result
      if (pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)) {
        arr = [
          ...result,
          {
            label: t('Pool'),
            type: 'pool',
            data: pool,
          },
        ]
      }
      return arr
    }, [])
  }, [t, poolsWithApy])

  const finixPrice = useMemo(() => convertToPriceFromSymbol(), [convertToPriceFromSymbol])

  // rebalances
  const rebalances = useRebalances()
  const rebalanceBalances = useRebalanceBalances(account) || {}
  const getRebalanceAddress = (address) => {
    return typeof address === 'string' ? address : getAddress(address)
  }
  const stakedRebalances = rebalances.reduce((result, rebalance) => {
    let arr = result
    const myRebalanceBalance = rebalanceBalances[getRebalanceAddress(rebalance.address)] || new BigNumber(0)
    if (myRebalanceBalance.toNumber() > 0) {
      arr = [
        ...result,
        {
          label: t('Rebalancing'),
          type: 'rebalancing',
          data: {
            apyValue: new BigNumber(finixPrice)
              .times(rebalance.finixRewardPerYear)
              .div(rebalance.totalAssetValue)
              .times(100)
              .toNumber(),
            ...rebalance,
            myRebalanceBalance,
          },
        },
      ]
    }
    return arr
  }, [])

  // long term stake
  const userLongTerStake = usePrivateData()
  const lockCount = useLockCount()
  const longTermAllowance = useAllowance()
  const longtermApr = useAprCardFarmHome()
  const isApprovedLongTerm = useMemo(() => {
    return account && longTermAllowance && longTermAllowance.isGreaterThan(0)
  }, [account, longTermAllowance])
  const stakedLongTermStake = useMemo(() => {
    const result = []
    if (isApprovedLongTerm && Number(lockCount) !== 0) {
      result.push({
        label: t('Long-term Stake'),
        type: 'longTermStake',
        data: {
          title: 'Long-term Stake',
          apyValue: typeof longtermApr !== 'number' || Number.isNaN(longtermApr) ? 0 : longtermApr,
          lpSymbol: 'longTermStake',
          value: new BigNumber(finixPrice).times(userLongTerStake.lockAmount).toNumber(),
          ...userLongTerStake,
        },
      })
    }
    return result
  }, [t, isApprovedLongTerm, lockCount, userLongTerStake, longtermApr, finixPrice])

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch])

  useEffect(() => {
    if (account && rebalances) {
      const addressObject = {}
      rebalances.forEach((rebalance) => {
        const assets = rebalance.ratio
        assets.forEach((a) => {
          addressObject[getAddress(a.address)] = true
        })
      })
      dispatch(
        fetchBalances(account, [
          ...Object.keys(addressObject),
          ...rebalances.map((rebalance) => getAddress(rebalance.address)),
        ]),
      )
      dispatch(fetchRebalanceBalances(account, rebalances))
    }
  }, [dispatch, account, rebalances])

  return [...stakedFarms, ...stakedPools, ...stakedRebalances, ...stakedLongTermStake].map((product) => {
    return {
      ...product,
      netWorth: getNetWorth(product.data),
    }
  })
}

export default useMyInvestments
