import BigNumber from 'bignumber.js'
import _ from 'lodash'
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import usePoolsList from 'hooks/usePoolsList'
import { useFarms, usePools, useBalances } from 'state/hooks'
import { fetchBalances } from 'state/wallet'
import { getAddress } from 'utils/addressHelpers'
import { Box, DropdownOption, useMatchBreakpoints } from 'definixswap-uikit'
import NoResultArea from 'components/NoResultArea'
import PoolCard from './components/PoolCard/PoolCard'
import PoolCardGenesis from './components/PoolCardGenesis'
import PoolHeader from './components/PoolHeader'
import PoolFilter from './components/PoolFilter'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
import { IS_GENESIS } from '../../config'

const Pool: React.FC = () => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const { path } = useRouteMatch()
  const { account } = useWallet()
  const dispatch = useDispatch()
  const farms = useFarms()
  const pools = usePools(account)
  const balances = useBalances(account)
  const [stackedOnly, setStackedOnly] = useState(false)
  const [liveOnly, setLiveOnly] = useState(true)
  // const [isPhrase1, setIsPhrase1] = useState(false)
  const [pageState, setPageState] = useState<{
    state: string
    data: any
  }>({
    state: 'list',
    data: null,
  }) // 'list', 'deposit', 'remove',
  const orderFilter = useRef<{
    defaultIndex: number
    options: DropdownOption[]
  }>({
    defaultIndex: 0,
    options: [
      {
        id: 'sortOrder',
        label: t('Recommend'),
        orderBy: 'asc',
      },
      {
        id: 'apyValue',
        label: t('APR'),
        orderBy: 'desc',
      },
      {
        id: 'totalStakedValue',
        label: t('Total staked'),
        orderBy: 'desc',
      },
    ],
  })
  const [selectedOrderOptionIndex, setSelectedOrderOptionIndex] = useState<DropdownOption>()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  // const phrase1TimeStamp = process.env.REACT_APP_PHRASE_1_TIMESTAMP
  //   ? parseInt(process.env.REACT_APP_PHRASE_1_TIMESTAMP || '', 10) || new Date().getTime()
  //   : new Date().getTime()
  // const currentTime = new Date().getTime()

  const poolsWithApy = usePoolsList({ farms, pools })
  const targetPools = useMemo(() => {
    const [finishedPools, openPools] = partition(poolsWithApy, (pool) => pool.isFinished)
    return liveOnly ? openPools : finishedPools
  }, [liveOnly, poolsWithApy])
  const filteredPools = useMemo(() => {
    if (!stackedOnly) return targetPools
    return targetPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0))
  }, [stackedOnly, targetPools])
  const orderedPools = useMemo(() => {
    if (typeof selectedOrderOptionIndex !== 'number') return filteredPools
    const currentOrder = orderFilter.current.options[selectedOrderOptionIndex]
    return orderBy(filteredPools, currentOrder.id, currentOrder.orderBy)
  }, [filteredPools, selectedOrderOptionIndex])
  const displayPools = useMemo(() => {
    if (!searchKeyword.length) return orderedPools
    return orderedPools.filter((pool) => {
      return pool.tokenName.toLowerCase().includes(searchKeyword)
    })
  }, [searchKeyword, orderedPools])

  const onSelectAdd = useCallback((props: any) => {
    setPageState({
      state: 'deposit',
      data: props,
    })
  }, [])
  const onSelectRemove = useCallback((props: any) => {
    setPageState({
      state: 'withdraw',
      data: props,
    })
  }, [])

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

  // useEffect(() => {
  //   if (currentTime < phrase1TimeStamp) {
  //     setTimeout(() => {
  //       setIsPhrase1(true)
  //     }, phrase1TimeStamp - currentTime)
  //   } else {
  //     setIsPhrase1(true)
  //   }
  // }, [currentTime, phrase1TimeStamp])

  return (
    <>
      <Helmet>
        <title>Pool - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Box className={`mb-s${isMobile ? 40 : 80}`}>
        {pageState.state === 'list' && (
          <>
            <PoolHeader />
            <PoolFilter
              stackedOnly={stackedOnly}
              setStackedOnly={setStackedOnly}
              liveOnly={liveOnly}
              setLiveOnly={setLiveOnly}
              defaultOptionIndex={orderFilter.current.defaultIndex}
              orderOptions={orderFilter.current.options}
              orderBy={(index) => setSelectedOrderOptionIndex(index)}
              search={(keyword: string) => setSearchKeyword(keyword)}
            />

            {IS_GENESIS ? (
              <div>
                <Route exact path={`${path}`}>
                  <>
                    {poolsWithApy.map((pool) => (
                      <PoolCardGenesis key={pool.sousId} pool={pool} />
                    ))}
                    {/* <Coming /> */}
                  </>
                </Route>
              </div>
            ) : (
              <>
                <Route exact path={`${path}`}>
                  {displayPools.length > 0 ? (
                    <>
                      {displayPools.map((pool) => (
                        <PoolCard
                          key={pool.sousId}
                          pool={pool}
                          myBalanceInWallet={getMyBalanceInWallet(pool.tokenName, pool.stakingTokenAddress)}
                          onSelectAdd={onSelectAdd}
                          onSelectRemove={onSelectRemove}
                        />
                      ))}
                    </>
                  ) : (
                    <NoResultArea message={t('No search results')} />
                  )}
                </Route>
                {/* <Route path={`${path}/history`}>
                  {orderBy(finishedPools, ['sortOrder']).map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />
                  ))}
                </Route> */}
              </>
            )}
            {/* <TimerWrapper isPhrase1={!(currentTime < phrase1TimeStamp && isPhrase1 === false)} date={phrase1TimeStamp}>
            </TimerWrapper> */}
          </>
        )}
        {pageState.state === 'deposit' && (
          <>
            <Deposit
              sousId={pageState.data.sousId}
              isOldSyrup={pageState.data.isOldSyrup}
              isBnbPool={pageState.data.isBnbPool}
              tokenName={pageState.data.tokenName}
              totalStaked={pageState.data.totalStaked}
              myStaked={pageState.data.myStaked}
              max={pageState.data.max}
              apy={pageState.data.apy}
              onBack={() => {
                setPageState({
                  state: 'list',
                  data: null,
                })
              }}
            />
          </>
        )}
        {pageState.state === 'withdraw' && (
          <>
            <Withdraw
              sousId={pageState.data.sousId}
              isOldSyrup={pageState.data.isOldSyrup}
              tokenName={pageState.data.tokenName}
              totalStaked={pageState.data.totalStaked}
              myStaked={pageState.data.myStaked}
              max={pageState.data.max}
              apy={pageState.data.apy}
              onBack={() => {
                setPageState({
                  state: 'list',
                  data: null,
                })
              }}
            />
          </>
        )}
      </Box>
    </>
  )
}

// const TimerWrapper = ({ isPhrase1, date, children }) => {
//   return isPhrase1 ? (
//     children
//   ) : (
//     <>
//       <div>
//         <br />
//         <Flip date={date} />
//         <br />
//         <br />
//         <br />
//       </div>
//       {children}
//     </>
//   )
// }

export default Pool
