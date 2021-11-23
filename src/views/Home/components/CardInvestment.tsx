import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardBody,
  ColorStyles,
} from 'definixswap-uikit'
import useFarmEarning from 'hooks/useFarmEarning'
import usePoolEarning from 'hooks/usePoolEarning'
import { usePriceFinixUsd } from 'state/hooks'
import EarningBoxTemplate from 'views/MyInvestments/components/EarningBoxTemplate'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'

const CardInvestment = () => {
  const { account } = useWallet()
  const { t } = useTranslation()

  const finixPrice = usePriceFinixUsd()

  /**
   * farm
   */
  const farmEarnings = useFarmEarning()
  const farmEarningsSum = useMemo(() => {
    return farmEarnings.reduce((accum, earning) => {
      return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
    }, 0)
  }, [farmEarnings])
  const farmEarningBusd = useMemo(() => {
    return new BigNumber(farmEarningsSum).multipliedBy(finixPrice).toNumber()
  }, [farmEarningsSum, finixPrice])

  /**
   * pool
   */
  const poolEarnings = usePoolEarning()
  const poolEarningsSum = useMemo(() => {
    return poolEarnings.reduce((accum, earning) => {
      return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
    }, 0)
  }, [poolEarnings])
  const poolEarningsBusd = useMemo(() => {
    return new BigNumber(poolEarningsSum).multipliedBy(finixPrice).toNumber()
  }, [poolEarningsSum, finixPrice])

  /**
   * total
   */
  const earnedList = useMemo(() => {
    return [
      {
        title: t('Farm'),
        value: farmEarningsSum,
        price: farmEarningBusd,
      },
      {
        title: t('Pool'),
        value: poolEarningsSum,
        price: poolEarningsBusd,
      },
      // {
      //   title: t('Rebalancing'),
      //   value: '100,000,000.123456',
      //   price: '000000',
      // },
      // {
      //   title: t('Long-term Stake'),
      //   value: '100,000,000.123456',
      //   price: '000000',
      // },
    ]
  }, [t, farmEarningsSum, farmEarningBusd, poolEarningsSum, poolEarningsBusd])

  return (
    <Card bg={ColorStyles.DEEPBROWN}>
      <CardBody p="0">
        <EarningBoxTemplate
          theme="dark"
          isMobile={false}
          hasAccount={!!account}
          total={{
            title: t('Total Finix Earned'),
            value: earnedList.reduce((result, item) => result + item.value, 0),
            price: earnedList.reduce((result, item) => result + item.price, 0),
          }}
          valueList={earnedList}
        />
      </CardBody>
    </Card>
  )
}

export default CardInvestment
