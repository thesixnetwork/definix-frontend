import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Box, DropdownOption } from 'definixswap-uikit-v2'
import ListPageHeader from 'components/ListPageHeader'
import FarmFilter from './components/FarmFilter'
import FarmList from './components/FarmList'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
import FarmContext from './FarmContext'

const Wrap = styled(Box)`
  padding-bottom: ${({ theme }) => theme.spacing.S_80}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding-bottom: ${({ theme }) => theme.spacing.S_40}px;
  }
`

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const [stackedOnly, setStackedOnly] = useState(false)
  const [pageState, setPageState] = useState('list')
  const [pageData, setPageData] = useState(null)
  const [selectedOrderBy, setSelectedOrderBy] = useState<DropdownOption>()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pageState])

  return (
    <FarmContext.Provider
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
        <title>Farm - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Wrap>
        {pageState === 'list' && (
          <>
            <ListPageHeader type="farm" />
            <FarmFilter
              stackedOnly={stackedOnly}
              setStackedOnly={setStackedOnly}
              orderBy={(order) => setSelectedOrderBy(order)}
              search={(keyword: string) => setSearchKeyword(keyword)}
            />
            <Route exact path={`${path}`}>
              <FarmList stakedOnly={stackedOnly} searchKeyword={searchKeyword} orderBy={selectedOrderBy} />
            </Route>
            {/* <HelpButton size="sm" variant="secondary" className="px-2" startIcon={<HelpCircle className="mr-2" />}>
              Help
            </HelpButton> */}
          </>
        )}
        {pageState === 'deposit' && (
          <Deposit
            {...pageData}
            onBack={() => {
              setPageState('list')
              setPageData(null)
            }}
          />
        )}
        {pageState === 'withdraw' && (
          <Withdraw
            {...pageData}
            onBack={() => {
              setPageState('list')
              setPageData(null)
            }}
          />
        )}
      </Wrap>
    </FarmContext.Provider>
  )
}

export default Farms
