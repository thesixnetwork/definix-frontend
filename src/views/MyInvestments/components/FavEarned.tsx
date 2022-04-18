import BigNumber from 'bignumber.js'
import useWallet from 'hooks/useWallet'
import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { usePriceFinixUsd } from 'state/hooks'
import EarningBoxTemplate from './EarningBoxTemplate/index'

const FavEarnd: React.FC<{
  isMobile: boolean
  isMain?: boolean
  theme?: 'white' | 'dark'
  products: { [key: string]: any }
}> = ({ isMobile, isMain = false, products, theme = 'white' }) => {
  const { t } = useTranslation()
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
        title: t('Farm'),
        value: farmEarningsSum,
        price: convertEarningsSumToPrice(farmEarningsSum),
      },
      {
        title: t('Pool'),
        value: poolEarningsSum,
        price: convertEarningsSumToPrice(poolEarningsSum),
      },
      {
        title: t('Long-term Stake'),
        value: longTermStakeEarningsSum,
        price: convertEarningsSumToPrice(longTermStakeEarningsSum),
      },
    ]
  }, [t, farmEarningsSum, poolEarningsSum, longTermStakeEarningsSum, convertEarningsSumToPrice])

  return (
    <EarningBoxTemplate
      theme={theme}
      isMain={isMain}
      isMobile={isMobile}
      hasAccount={!!account}
      total={{
        title: t('Total Earned'),
        value: earnedList.reduce((result, item) => result + item.value, 0),
        price: earnedList.reduce((result, item) => result + item.price, 0),
      }}
      valueList={account ? earnedList : []}
      unit="FAV"
    />
  )
}

export default FavEarnd
