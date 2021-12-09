import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Box, DropdownOption } from 'definixswap-uikit-v2'
import ListPageHeader from 'components/ListPageHeader'
import PoolFilter from './components/PoolFilter'
import PoolList from './components/PoolList'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
import PoolContext from './PoolContext'

const Wrap = styled(Box)`
  padding-bottom: ${({ theme }) => theme.spacing.S_80}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding-bottom: ${({ theme }) => theme.spacing.S_40}px;
  }
`

const Pool: React.FC = () => {
  const { path } = useRouteMatch()
  const [stackedOnly, setStackedOnly] = useState(false)
  const [liveOnly, setLiveOnly] = useState(true)
  const [pageState, setPageState] = useState('list')
  const [pageData, setPageData] = useState(null)
  const [selectedOrderBy, setSelectedOrderBy] = useState<DropdownOption>()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pageState])

  return (
    <PoolContext.Provider
      value={{
        pageState,
        pageData,
        goDeposit: (data) => {
          setPageState('deposit')
          setPageData(data)
        },
        goWithdraw: (data) => {
          setPageState('withdraw')
          setPageData(data)
        },
      }}
    >
      <Helmet>
        <title>Pool - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Wrap>
        {pageState === 'list' && (
          <>
            <ListPageHeader type="pool" />
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
        {pageState === 'deposit' && (
          <>
            <Deposit
              {...pageData}
              onBack={() => {
                setPageState('list')
                setPageData(null)
              }}
            />
          </>
        )}
        {pageState === 'withdraw' && (
          <>
            <Withdraw
              {...pageData}
              onBack={() => {
                setPageState('list')
                setPageData(null)
              }}
            />
          </>
        )}
      </Wrap>
    </PoolContext.Provider>
  )
}

export default Pool
