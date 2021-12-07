import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import React, { useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useFarms, usePools, useBalances } from 'state/hooks'
import { fetchBalances } from 'state/wallet'
import usePoolsList from 'hooks/usePoolsList'
import { getAddress } from 'utils/addressHelpers'
import { DropdownOption } from 'definixswap-uikit'
import NoResultArea from 'components/NoResultArea'
import PoolCard from '../PoolCard/PoolCard'

const PoolList: React.FC<{
  liveOnly: boolean
  stakedOnly: boolean
  searchKeyword: string
  orderBy: DropdownOption
}> = ({ liveOnly, stakedOnly, searchKeyword, orderBy }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const farms = useFarms()
  const pools = usePools(account)
  const poolsWithApy = usePoolsList({ farms, pools })

  const targetPools = useMemo(() => {
    const [finishedPools, openPools] = _.partition(poolsWithApy, (pool) => pool.isFinished)
    return liveOnly ? openPools : finishedPools
  }, [liveOnly, poolsWithApy])

  const filteredPools = useMemo(() => {
    if (!stakedOnly) return targetPools
    return targetPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0))
  }, [stakedOnly, targetPools])

  const orderedPools = useMemo(() => {
    if (!orderBy) return filteredPools
    return _.orderBy(filteredPools, orderBy.id, orderBy.orderBy)
  }, [filteredPools, orderBy])

  const displayPools = useMemo(() => {
    if (!searchKeyword.length) return orderedPools
    return orderedPools.filter((pool) => {
      return pool.tokenName.toLowerCase().includes(searchKeyword)
    })
  }, [searchKeyword, orderedPools])

  const getMyBalanceInWallet = useCallback(
    (tokenName: string, tokenAddress: string) => {
      if (balances) {
        const address = tokenName === 'WKLAY' ? 'main' : tokenAddress
        return _.get(balances, address)
      }
      return null
    },
    [balances],
  )

  const fetchAllBalances = useCallback(() => {
    if (balances) return
    if (account && !!poolsWithApy.length) {
      const assetAddresses = poolsWithApy.map((pool) => {
        return getAddress({ [process.env.REACT_APP_CHAIN_ID]: pool.stakingTokenAddress })
      })
      dispatch(fetchBalances(account, assetAddresses))
    }
  }, [dispatch, account, poolsWithApy, balances])

  useEffect(() => {
    fetchAllBalances()
  }, [fetchAllBalances])

  return displayPools.length > 0 ? (
    <>
      {displayPools.map((pool) => (
        <PoolCard
          key={pool.sousId}
          pool={pool}
          myBalanceInWallet={getMyBalanceInWallet(pool.tokenName, pool.stakingTokenAddress)}
        />
      ))}
    </>
  ) : (
    <NoResultArea message={t('No search results')} />
  )
}

export default PoolList
