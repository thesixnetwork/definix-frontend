
import _ from 'lodash'
import React, { useState, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'

import { Box, DropdownOption, useMatchBreakpoints } from 'definixswap-uikit'
// import PoolCardGenesis from './components/PoolCardGenesis'
import PoolHeader from './components/PoolHeader'
import PoolFilter from './components/PoolFilter'
import PoolList from './components/PoolList'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
// import { IS_GENESIS } from '../../config'

const Pool: React.FC = () => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const { path } = useRouteMatch()
  
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
  const [selectedOrderOptionIndex, setSelectedOrderOptionIndex] = useState<number>(0)
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  // const phrase1TimeStamp = process.env.REACT_APP_PHRASE_1_TIMESTAMP
  //   ? parseInt(process.env.REACT_APP_PHRASE_1_TIMESTAMP || '', 10) || new Date().getTime()
  //   : new Date().getTime()
  // const currentTime = new Date().getTime()
  
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

            <>
              <Route exact path={`${path}`}>
                <PoolList
                  liveOnly={liveOnly}
                  stakedOnly={stackedOnly}
                  searchKeyword={searchKeyword}
                  orderBy={orderFilter.current.options[selectedOrderOptionIndex]}
                  goDeposit={(props: any) => {
                    setPageState({
                      state: 'deposit',
                      data: props,
                    })
                  }}
                  goRemove={(props: any) => {
                    setPageState({
                      state: 'withdraw',
                      data: props,
                    })
                  }}
                />
              </Route>
              {/* <Route path={`${path}/history`}>
                {orderBy(finishedPools, ['sortOrder']).map((pool) => (
                  <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />
                ))}
              </Route> */}
            </>

            {/* <Route exact path={`${path}`}>
              <>
                {poolsWithApy.map((pool) => (
                  <PoolCardGenesis key={pool.sousId} pool={pool} />
                ))}
                <Coming />
              </>
            </Route> */}
            {/* <TimerWrapper isPhrase1={!(currentTime < phrase1TimeStamp && isPhrase1 === false)} date={phrase1TimeStamp}>
            </TimerWrapper> */}
          </>
        )}
        {pageState.state === 'deposit' && (
          <>
            <Deposit
              {...pageState.data}
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
              {...pageState.data}
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
