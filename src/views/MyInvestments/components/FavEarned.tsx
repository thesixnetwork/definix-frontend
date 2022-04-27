import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'
import useWallet from 'hooks/useWallet'
import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { usePriceFavorUsd } from 'state/hooks'
import EarningBoxTemplate from './EarningBoxTemplate/index'

const FavEarnd: React.FC<{
  isMobile: boolean
  isMain?: boolean
  theme?: 'white' | 'dark'
  products: { [key: string]: any }
}> = ({ isMobile, isMain = false, products, theme = 'white' }) => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const favorPrice = usePriceFavorUsd()

  const convertEarningsSumToPrice = useCallback(
    (value) => {
      return new BigNumber(value).multipliedBy(favorPrice).toNumber()
    },
    [favorPrice],
  )

  const calculateEarning = useCallback((value) => {
    return new BigNumber(value).div(new BigNumber(10).pow(18)) || 0
  }, [])

  const farmEarningsSum = useMemo(() => {
    if (!Array.isArray(products.farm)) return 0
    return products.farm
      .reduce((accum, farm) => {
        return accum.plus(calculateEarning(farm.data.userData?.pendingRewards[0]?.reward))
      }, new BigNumber(0))
      .toNumber()
  }, [products.farm, calculateEarning])


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
    ]
  }, [t, farmEarningsSum, convertEarningsSumToPrice])

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
      unit={QuoteToken.FINGER}
    />
  )
}

export default FavEarnd
