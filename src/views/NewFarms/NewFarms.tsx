import _ from 'lodash'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import useRefresh from 'hooks/useRefresh'
import useFarmsList from 'hooks/useFarmsList'
import { fetchFarmUserDataAsync, fetchBalances } from 'state/actions'
import { useFarms, useBalances } from 'state/hooks'
import { getAddress } from 'utils/addressHelpers'
import { getTokenSymbol } from 'utils/getTokenSymbol'
import { TitleSet, Box, DropdownOption, useMatchBreakpoints } from 'definixswap-uikit'
// import Flip from '../../uikit-dev/components/Flip'
import FarmCard from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

const Farms: React.FC = () => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const { path } = useRouteMatch()
  const dispatch = useDispatch()
  const farmsLP = useFarms()
  const { fastRefresh } = useRefresh()
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const balances = useBalances(account)

  // const [listView, setListView] = useState(true)
  // const [isPhrase2, setIsPhrase2] = useState(false)
  const [stackedOnly, setStackedOnly] = useState(false)
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
        label: 'sortOrder',
        orderBy: 'asc',
      },
      {
        id: 'apyValue',
        label: 'apr',
        orderBy: 'desc',
      },
      {
        id: 'totalLiquidityValue',
        label: 'totalLiquidity',
        orderBy: 'desc',
      },
    ],
  })
  const [selectedOrderOptionIndex, setSelectedOrderOptionIndex] = useState<DropdownOption>()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  // const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
  //   ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
  //   : new Date().getTime()
  // const currentTime = new Date().getTime()

  const farmsWithApy = useFarmsList(farmsLP)
  // const targetFarms = useMemo(() => {
  //   return farmsWithApy.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X')
  // }, [farmsWithApy])
  const filteredFarms = useMemo(() => {
    return stackedOnly
      ? farmsWithApy.filter((farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
      : farmsWithApy
  }, [stackedOnly, farmsWithApy])
  const orderedFarms = useMemo(() => {
    if (typeof selectedOrderOptionIndex !== 'number') return filteredFarms
    const currentOrder = orderFilter.current.options[selectedOrderOptionIndex]
    return _.orderBy(filteredFarms, currentOrder.id, currentOrder.orderBy)
  }, [filteredFarms, selectedOrderOptionIndex])
  const displayFarms = useMemo(() => {
    if (!searchKeyword.length) return orderedFarms
    return orderedFarms.filter((farm) => {
      return farm.lpSymbol.toLowerCase().includes(searchKeyword)
    })
  }, [searchKeyword, orderedFarms])

  const onSelectAddLP = useCallback((props: any) => {
    setPageState({
      state: 'deposit',
      data: props,
    })
  }, [])
  const onSelectRemoveLP = useCallback((props: any) => {
    setPageState({
      state: 'withdraw',
      data: props,
    })
  }, [])

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

  // useEffect(() => {
  //   if (currentTime < phrase2TimeStamp) {
  //     setTimeout(() => {
  //       setIsPhrase2(true)
  //     }, phrase2TimeStamp - currentTime)
  //   } else {
  //     setIsPhrase2(true)
  //   }
  // }, [currentTime, phrase2TimeStamp])

  useEffect(() => {
    fetchAllBalances()
  }, [fetchAllBalances])

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  useEffect(() => {
    return () => {
      setStackedOnly(false)
      // setListView(true)
      // setIsPhrase2(false)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Farm - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Box className={`mb-s${isMobile ? 40 : 80}`}>
        {pageState.state === 'list' && (
          <>
            <TitleSet
              title="Farm"
              description={t('Pairing coins to create LP')}
              linkLabel={t('Learn how to stake in Farm')}
              link="https://sixnetwork.gitbook.io/definix-on-klaytn-en/yield-farming/how-to-yield-farm-on-definix"
            />
            <FarmTabButtons
              stackedOnly={stackedOnly}
              setStackedOnly={setStackedOnly}
              defaultOptionIndex={orderFilter.current.defaultIndex}
              orderOptions={orderFilter.current.options}
              orderBy={(index) => setSelectedOrderOptionIndex(index)}
              search={(keyword: string) => setSearchKeyword(keyword)}
            />
            <Route exact path={`${path}`}>
              {/* {stackedOnly ? farmsList(stackedOnlyFarms, false) : farmsList(activeFarms, false)} */}
              {displayFarms.map((farm) => (
                <FarmCard
                  key={farm.pid}
                  farm={farm}
                  myBalancesInWallet={getMyBalancesInWallet([farm.firstToken, farm.secondToken])}
                  removed={false}
                  klaytn={klaytn}
                  account={account}
                  onSelectAddLP={onSelectAddLP}
                  onSelectRemoveLP={onSelectRemoveLP}
                />
              ))}
            </Route>
            {/* <HelpButton size="sm" variant="secondary" className="px-2" startIcon={<HelpCircle className="mr-2" />}>
              Help
            </HelpButton> */}
            {/* <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
              <Route exact path={`${path}/history`}>
                {farmsList(inactiveFarms, true)}
              </Route>
            </TimerWrapper> */}
          </>
        )}
        {pageState.state === 'deposit' && (
          <Deposit
            {...pageState.data}
            onBack={() => {
              setPageState({
                state: 'list',
                data: null,
              })
            }}
          />
        )}
        {pageState.state === 'withdraw' && (
          <Withdraw
            {...pageState.data}
            onBack={() => {
              setPageState({
                state: 'list',
                data: null,
              })
            }}
          />
        )}
      </Box>
    </>
  )
}

// const TimerWrapper = ({ isPhrase2, date, children }) => {
//   return isPhrase2 ? (
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
//       <div
//         tabIndex={0}
//         role="button"
//         style={{ opacity: 0.4, pointerEvents: 'none' }}
//         onClick={(e) => {
//           e.preventDefault()
//         }}
//         onKeyDown={(e) => {
//           e.preventDefault()
//         }}
//       >
//         {children}
//       </div>
//     </>
//   )
// }

export default Farms
