import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, fetchBalances } from 'state/actions'
import { useFarms, useBalances } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import useFarmsList from 'hooks/useFarmsList'
import { getAddress } from 'utils/addressHelpers'
import { getTokenSymbol } from 'utils/getTokenSymbol'
import { DropdownOption } from 'definixswap-uikit'
import NoResultArea from 'components/NoResultArea'
import FarmCard from '../FarmCard/FarmCard'
import { FarmWithStakedValue } from '../FarmCard/types'

const FarmList: React.FC<{
  stakedOnly: boolean
  searchKeyword: string
  orderBy: DropdownOption
  goDeposit: (props: any) => void
  goRemove: (props: any) => void
}> = ({ stakedOnly, searchKeyword, orderBy, goDeposit, goRemove }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const balances = useBalances(account)
  const farmsLP = useFarms()
  const farmsWithApy: FarmWithStakedValue[] = useFarmsList(farmsLP)

  const filteredFarms = useMemo(() => {
    return stakedOnly
      ? farmsWithApy.filter((farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
      : farmsWithApy
  }, [stakedOnly, farmsWithApy])

  const orderedFarms = useMemo(() => {
    if (!orderBy) return filteredFarms
    return _.orderBy(filteredFarms, orderBy.id, orderBy.orderBy)
  }, [filteredFarms, orderBy])

  const displayFarms = useMemo(() => {
    if (!searchKeyword.length) return orderedFarms
    return orderedFarms.filter((farm) => {
      return farm.lpSymbol.toLowerCase().includes(searchKeyword)
    })
  }, [searchKeyword, orderedFarms])

  const getMyBalancesInWallet = useCallback(
    (tokens: string[]) => {
      return tokens.reduce((result, token) => {
        const obj = {}
        const realTokenAddress = getAddress(token)
        obj[getTokenSymbol(realTokenAddress)] = balances ? _.get(balances, realTokenAddress) : null
        return { ...result, ...obj }
      }, {})
    },
    [balances],
  )

  const fetchAllBalances = useCallback(() => {
    if (balances) return
    if (account && !!farmsWithApy.length) {
      const allLPaddresses = farmsWithApy.reduce((addressArray, farm) => {
        return [...addressArray, getAddress(farm.firstToken), getAddress(farm.secondToken)]
      }, [])
      dispatch(fetchBalances(account, _.uniq(allLPaddresses)))
    }
  }, [account, farmsWithApy, balances, dispatch])

  useEffect(() => {
    fetchAllBalances()
  }, [fetchAllBalances])

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, slowRefresh])

  return displayFarms.length > 0 ? (
    <>
      {displayFarms.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          myBalancesInWallet={getMyBalancesInWallet([farm.firstToken, farm.secondToken])}
          removed={false}
          klaytn={klaytn}
          account={account}
          onSelectAddLP={goDeposit}
          onSelectRemoveLP={goRemove}
        />
      ))}
    </>
  ) : (
    <NoResultArea message={t('No search results')} />
  )
}

export default FarmList
