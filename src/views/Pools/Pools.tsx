import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import React, { useState, useEffect } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Box, DropdownOption } from '@fingerlabs/definixswap-uikit-v2'
import ListPageHeader from 'components/ListPageHeader'
import PoolFilter from './components/PoolFilter'
import PoolList from './components/PoolList'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
import PoolContext from './PoolContext'

const Wrap = styled(Box)<{ pageState: string }>`
  margin: 0 auto;
  padding-bottom: ${({ theme }) => theme.spacing.S_80}px;
  max-width: ${({ pageState }) => (pageState === 'list' ? '100%' : '630px')};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding-bottom: ${({ theme }) => theme.spacing.S_40}px;
  }
`

const Pool: React.FC = () => {
  const { account }: { account: string } = useWallet()
  const { path } = useRouteMatch()
  const [stackedOnly, setStackedOnly] = useState(false)
  // const [liveOnly, setLiveOnly] = useState(true)
  const [pageState, setPageState] = useState('list')
  const [pageData, setPageData] = useState(null)
  const [selectedOrderBy, setSelectedOrderBy] = useState<DropdownOption>()
  // const [searchKeyword, setSearchKeyword] = useState<string>('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pageState])

  useEffect(() => {
    if (typeof account !== 'string') {
      setPageState('list')
      setPageData(null)
    }
  }, [account])

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
      <Wrap pageState={pageState}>
        {pageState === 'list' && (
          <>
            <Box position="relative">
              <ListPageHeader type="pool" />
              <PoolFilter
                stackedOnly={stackedOnly}
                setStackedOnly={setStackedOnly}
                orderBy={(order) => setSelectedOrderBy(order)}
              />
            </Box>

            <>
              <Route exact path={`${path}`}>
                <PoolList stakedOnly={stackedOnly} orderBy={selectedOrderBy} />
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
