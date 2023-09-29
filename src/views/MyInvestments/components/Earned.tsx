import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import React, { useMemo, useCallback } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import EarningBoxTemplate from './EarningBoxTemplate/index'

const Earned: React.FC<{
  isMobile: boolean
  isMain?: boolean
  theme?: 'white' | 'dark'
  products: { [key: string]: any }
}> = ({ isMobile, isMain = false, products, theme = 'white' }) => {
  const { account } = useWallet()
  const finixPrice = usePriceFinixUsd()

  const convertEarningsSumToPrice = useCallback(
    (value) => {
      return new BigNumber(value).multipliedBy(finixPrice).toNumber()
    },
    [finixPrice],
  )

  const calculateEarning = useCallback((value) => {
    return new BigNumber(value).div(new BigNumber(10).pow(18)) || 0
  }, [])

  const farmEarningsSum = useMemo(() => {
    if (!Array.isArray(products.farm)) return 0
    return products.farm
      .reduce((accum, farm) => {
        return accum.plus(calculateEarning(farm.data.userData.earnings))
      }, new BigNumber(0))
      .toNumber()
  }, [products.farm, calculateEarning])

  const poolEarningsSum = useMemo(() => {
    if (!Array.isArray(products.pool)) return 0
    return products.pool
      .reduce((accum, pool) => {
        return accum.plus(calculateEarning(pool.data.userData.pendingReward))
      }, new BigNumber(0))
      .toNumber()
  }, [products.pool, calculateEarning])

  const longTermStakeEarningsSum = useMemo(() => {
    if (!Array.isArray(products.longTermStake)) return 0
    return products.longTermStake
      .reduce((accum, longTermStake) => {
        return accum.plus(new BigNumber(longTermStake.data.finixEarn) || 0)
      }, new BigNumber(0))
      .toNumber()
  }, [products.longTermStake])

  /**
   * total
   */
  const earnedList = useMemo(() => {
    return [
      {
        title: 'Farm',
        value: farmEarningsSum,
        price: convertEarningsSumToPrice(farmEarningsSum),
      },
      {
        title: 'Pool',
        value: poolEarningsSum,
        price: convertEarningsSumToPrice(poolEarningsSum),
      },
      {
        title: 'Long-term Stake',
        value: longTermStakeEarningsSum,
        price: convertEarningsSumToPrice(longTermStakeEarningsSum),
      },
    ]
  }, [farmEarningsSum, poolEarningsSum, longTermStakeEarningsSum, convertEarningsSumToPrice])

  return (
    <EarningBoxTemplate
      theme={theme}
      isMain={isMain}
      isMobile={isMobile}
      hasAccount={!!account}
      total={{
        title: 'Total Earned',
        value: earnedList.reduce((result, item) => result + item.value, 0),
        price: earnedList.reduce((result, item) => result + item.price, 0),
      }}
      valueList={account ? earnedList : []}
      unit="FINIX"
    />
  )
}

export default Earned
