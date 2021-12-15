import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import EarningBoxTemplate from './EarningBoxTemplate/index'

const NetWorth: React.FC<{
  isMobile: boolean
  products: { [key: string]: any[] }
}> = ({ isMobile, products }) => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const filledProducts = useMemo(() => {
    // { farm: [], pool: [], rebalancing: [], ... }
    return {
      farm: [],
      pool: [],
      rebalancing: [],
      ...products,
    }
  }, [products])

  const titleList = useMemo(() => {
    return {
      farm: t('Farm'),
      pool: t('Pool'),
      rebalancing: t('Rebalancing'),
    }
  }, [t])
  const netWorthList = useMemo(() => {
    return Object.entries(filledProducts).map(([type, product]) => {
      return {
        title: titleList[type],
        price: product.reduce((all, f) => all + Number(f.netWorth), 0),
      }
    })
  }, [filledProducts, titleList])

  return (
    <>
      <EarningBoxTemplate
        isMobile={isMobile}
        hasAccount={!!account}
        total={{
          title: t('Total Deposit'),
          price: netWorthList.reduce((result, item) => result + item.price, 0),
        }}
        valueList={netWorthList}
      />
    </>
  )
}

export default NetWorth
