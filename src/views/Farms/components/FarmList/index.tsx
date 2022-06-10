import { orderBy as lorderBy, get, uniq } from 'lodash-es'
import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, fetchBalances } from 'state/actions'
import { useFarms, useBalances } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import useFarmsList from 'hooks/useFarmsList'
import { getAddress, getWklayAddress } from 'utils/addressHelpers'
import { getTokenSymbol } from 'utils/getTokenSymbol'
import { DropdownOption } from '@fingerlabs/definixswap-uikit-v2'
import NoResultArea from 'components/NoResultArea'
import useWallet from 'hooks/useWallet'
import FarmCard from '../FarmCard/FarmCard'
import { FarmWithStakedValue } from '../FarmCard/types'
import { resetFarmUserData } from 'state/farms'

const FarmList: React.FC<{
  stakedOnly: boolean
  searchKeyword: string
  orderBy: DropdownOption
  isFinished: boolean
}> = ({ stakedOnly, searchKeyword, orderBy, isFinished }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  const { account, klaytn } = useWallet()

  const balances = useBalances(account)
  const farmsLP = useFarms()
  const farmsWithApy: FarmWithStakedValue[] = useFarmsList(farmsLP)

  const filteredFarms = useMemo(() => {
    let result = farmsWithApy;
    
    if (stakedOnly) {
      result = result.filter((farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
    }
    if (isFinished) {
      result = result.filter((farm) => farm.isFinished)
    }
    return result
  }, [stakedOnly, farmsWithApy, isFinished])

  const orderedFarms = useMemo(() => {
    if (!orderBy) return filteredFarms
    return lorderBy(filteredFarms, orderBy.id, orderBy.orderBy)
  }, [filteredFarms, orderBy])

  const displayFarms = useMemo(() => {
    if (!searchKeyword.length) return orderedFarms
    return orderedFarms.filter((farm) => {
      return farm.lpSymbol.toLowerCase().includes(searchKeyword)
    })
  }, [searchKeyword, orderedFarms])

  const emptyAreaMessage = useMemo(() => {
    if (farmsWithApy.length === 0) return t('Loading data')
    return stakedOnly ? t('There are no farms in deposit.') : t('No search results')
  }, [t, stakedOnly, farmsWithApy])

  const getTokenAddress = useCallback((token: string) => {
    const realTokenAddress = getAddress(token)
    // for klay
    return realTokenAddress === getWklayAddress() ? 'main' : realTokenAddress
  }, [])

  const getMyBalancesInWallet = useCallback(
    (tokens: string[]) => {
      return tokens.reduce((result, token) => {
        const obj = {}
        const realTokenAddress = getTokenAddress(token)
        obj[getTokenSymbol(realTokenAddress)] = balances ? get(balances, realTokenAddress) : null
        return { ...result, ...obj }
      }, {})
    },
    [balances, getTokenAddress],
  )

  const fetchAllBalances = useCallback(() => {
    if (balances) return
    if (account && !!farmsWithApy.length) {
      const allLPaddresses = farmsWithApy.reduce((addressArray, farm) => {
        return [...addressArray, getAddress(farm.firstToken), getAddress(farm.secondToken)]
      }, [])
      dispatch(fetchBalances(account, uniq(allLPaddresses)))
    }
  }, [account, farmsWithApy, balances, dispatch])

  useEffect(() => {
    fetchAllBalances()
  }, [fetchAllBalances])

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    } else {
      dispatch(resetFarmUserData())
    }
  }, [account, dispatch, slowRefresh])

  return displayFarms.length > 0 ? (
    <>
      {displayFarms.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          myBalancesInWallet={getMyBalancesInWallet([farm.firstToken, farm.secondToken])}
          klaytn={klaytn}
          account={account}
        />
      ))}
    </>
  ) : (
    <NoResultArea message={emptyAreaMessage} />
  )
}

export default FarmList
