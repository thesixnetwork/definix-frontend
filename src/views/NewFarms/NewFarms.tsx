import React, { useEffect, useState, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { Box, useMatchBreakpoints, DropdownOption } from 'definixswap-uikit'
import FarmHeader from './components/FarmHeader'
import FarmFilter from './components/FarmFilter'
import FarmList from './components/FarmList'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

const Farms: React.FC = () => {
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const { path } = useRouteMatch()
  const [stackedOnly, setStackedOnly] = useState(false)
  const [pageState, setPageState] = useState<{
    state: string
    data: any
  }>({
    state: 'list',
    data: null,
  }) // 'list', 'deposit', 'remove',
  const [selectedOrderBy, setSelectedOrderBy] = useState<DropdownOption>()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  useEffect(() => {
    return () => {
      setStackedOnly(false)
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
            <FarmHeader />
            <FarmFilter
              stackedOnly={stackedOnly}
              setStackedOnly={setStackedOnly}
              orderBy={(order) => setSelectedOrderBy(order)}
              search={(keyword: string) => setSearchKeyword(keyword)}
            />
            <Route exact path={`${path}`}>
              <FarmList
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
            {/* <HelpButton size="sm" variant="secondary" className="px-2" startIcon={<HelpCircle className="mr-2" />}>
              Help
            </HelpButton> */}
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

export default Farms
