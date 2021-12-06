import _ from 'lodash'
import React, { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'

import { Box, useMatchBreakpoints, DropdownOption } from 'definixswap-uikit'
import PoolHeader from './components/PoolHeader'
import PoolFilter from './components/PoolFilter'
import PoolList from './components/PoolList'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

const Pool: React.FC = () => {
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const { path } = useRouteMatch()

  const [stackedOnly, setStackedOnly] = useState(false)
  const [liveOnly, setLiveOnly] = useState(true)
  const [pageState, setPageState] = useState<{
    state: string
    data: any
  }>({
    state: 'list',
    data: null,
  }) // 'list', 'deposit', 'remove',

  const [selectedOrderBy, setSelectedOrderBy] = useState<DropdownOption>()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

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
              orderBy={(order) => setSelectedOrderBy(order)}
              search={(keyword: string) => setSearchKeyword(keyword)}
            />

            <>
              <Route exact path={`${path}`}>
                <PoolList
                  liveOnly={liveOnly}
                  stakedOnly={stackedOnly}
                  searchKeyword={searchKeyword}
                  orderBy={selectedOrderBy}
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

export default Pool
