// import useWallet from 'hooks/useWallet'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useMemo } from 'react'
import EarningBoxTemplate from './EarningBoxTemplate/index'

const NetWorth: React.FC<{
  isMobile: boolean
  products: { [key: string]: any[] }
}> = ({ isMobile, products }) => {
  const { account } = useWallet()
  const filledProducts = useMemo(() => {
    // { farm: [], pool: [], rebalancing: [], ... }
    return {
      farm: [],
      pool: [],
      rebalancing: [],
      longTermStake: [],
      ...products,
    }
  }, [products])

  const titleList = useMemo(() => {
    return {
      farm: 'Farm',
      pool: 'Pool',
      rebalancing: 'Rebalancing',
      longtermstake: 'Long-term Stake',
    }
  }, [])

  const netWorthList = useMemo(() => {
    return Object.entries(filledProducts).map(([type, product]) => {
      return {
        title: titleList[type.toLowerCase()],
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
          title: 'Total Deposit',
          price: netWorthList.reduce((result, item) => result + item.price, 0),
        }}
        valueList={netWorthList}
        useHarvestButton={false}
      />
    </>
  )
}

export default NetWorth
