import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'
import React, { useMemo, useCallback } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import EarningBoxTemplate from './EarningBoxTemplate/index'

const FavEarnd: React.FC<{
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
        title: 'Farm',
        value: farmEarningsSum,
        price: convertEarningsSumToPrice(farmEarningsSum),
      },
    ]
  }, [farmEarningsSum, convertEarningsSumToPrice])

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
      unit={QuoteToken.FINIX}
    />
  )
}

export default FavEarnd
