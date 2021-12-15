import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { provider } from 'web3-core'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import useFarmsList from 'hooks/useFarmsList'
import usePoolsList from 'hooks/usePoolsList'
import { useLockCount, useAllowance, usePrivateData, useAprCardFarmHome } from 'hooks/useLongTermStake'
import useConverter from 'hooks/useConverter'
import { useBalances, useRebalances, useRebalanceBalances, useFarms, usePools } from 'state/hooks'
import { fetchFarmUserDataAsync } from 'state/actions'
import { fetchBalances, fetchRebalanceBalances } from 'state/wallet'
import { getAddress } from 'utils/addressHelpers'
import { Box, Card, DropdownOption } from '@fingerlabs/definixswap-uikit-v2'
import CardSummary from './components/CardSummary'
import MyProductsFilter from './components/MyProductsFilter'
import MyProducts from './components/MyProducts'

const Wrap = styled(Box)`
  padding-bottom: ${({ theme }) => theme.spacing.S_80}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding-bottom: ${({ theme }) => theme.spacing.S_40}px;
  }
`

const MyInvestments: React.FC = () => {
  const { t } = useTranslation()
  const { path } = useRouteMatch()

  const [currentProductType, setCurrentProductType] = useState<string>('')
  const [selectedOrderBy, setSelectedOrderBy] = useState<DropdownOption>()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const { account }: { account: string; klaytn: provider } = useWallet()
  const { convertToPriceFromToken } = useConverter()
  const dispatch = useDispatch()
  const balances = useBalances(account)

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
          apyValue: typeof longtermApr !== 'number' || Number.isNaN(longtermApr) ? 0 : longtermApr,
          ...userLongTerStake,
        },
      })
    }
    return result
  }, [t, isApprovedLongTerm, lockCount, userLongTerStake, longtermApr])

  // Net Worth
  const getNetWorth = (d) => {
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

  const stakedProducts = useMemo(() => {
    return [...stakedFarms, ...stakedPools, ...stakedRebalances, ...stakedLongTermStake]
  }, [stakedFarms, stakedPools, stakedRebalances, stakedLongTermStake])

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

  return account ? (
    <Wrap>
      <Route exact path={`${path}`}>
        <CardSummary
          products={stakedProducts.map((product) => {
            return {
              ...product,
              netWorth: getNetWorth(product.data),
            }
          })}
        />
        <Card className="mt-s16">
          <MyProductsFilter
            onChangeDisplayFilter={(keyword: string) => setCurrentProductType(keyword)}
            onChangeOrderFilter={(orderBy: DropdownOption) => setSelectedOrderBy(orderBy)}
            onChangeSearchInput={(keyword: string) => setSearchKeyword(keyword)}
          />
          <MyProducts
            productType={currentProductType}
            orderBy={selectedOrderBy}
            searchKeyword={searchKeyword}
            products={stakedProducts}
          />
        </Card>
      </Route>
    </Wrap>
  ) : (
    <Redirect to="/" />
  )
}

export default MyInvestments
