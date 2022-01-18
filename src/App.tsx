import React, { lazy, Suspense, useEffect } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import { Helmet } from 'react-helmet-async'

import { Route, Router, Switch } from 'react-router-dom'
import { Config } from 'definixswap-sdk'
import { useFetchProfile, useFetchPublicData, usePriceFinixUsd } from 'state/hooks'
import { GlobalStyle, Loading } from '@fingerlabs/definixswap-uikit-v2'
import Menu from './components/Menu'
import ToastListener from './components/ToastListener'
import history from './routerHistory'
import sdkConfig from './sdkconfig'

Config.configure(sdkConfig)

// Route-based code splitting
// Only pool is included in the main bucndle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Voting = lazy(() => import('./views/Voting_v2'))
const Pools = lazy(() => import('./views/Pools'))
const NewFarms = lazy(() => import('./views/NewFarms'))
const Explore = lazy(() => import('./views/Explore'))
const Error = lazy(() => import('./views/Error'))
const MyInvestments = lazy(() => import('./views/MyInvestments'))
const LongTermStakeV2 = lazy(() => import('./views/LongTermStake_v2'))
const SuperStake = lazy(() => import('./views/LongTermStake_v2/SuperStake'))
const Bridge = lazy(() => import('./views/Bridge'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account, connect } = useWallet()

  useEffect(() => {
    console.warn = () => null
  }, [])

  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus') && checkConnector('injected')) {
      connect('injected')
    } else if (
      !account &&
      window.localStorage.getItem('accountStatus') &&
      checkConnector('klip') &&
      window.localStorage.getItem('userAccount')
    ) {
      connect('klip')
    }
  }, [account, connect])
  const checkConnector = (connector: string) => window.localStorage.getItem('connector') === connector
  useFetchPublicData()
  useFetchProfile()

  const finixPrice = usePriceFinixUsd()

  return (
    <Router history={history}>
      <Helmet>
        <title>
          Definix{!finixPrice ? '' : ` - ${finixPrice?.toFixed(4)} FINIX/USD`}
        </title>
      </Helmet>
      <GlobalStyle />
      <Suspense fallback={<></>}>
        <Menu>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/pool">
                <Pools />
              </Route>
              <Route path="/farm">
                <NewFarms />
              </Route>
              <Route path="/rebalancing">
                <Explore />
              </Route>
              <Route path="/my">
                <MyInvestments />
              </Route>
              <Route path="/long-term-stake">
                <LongTermStakeV2 />
              </Route>
              <Route path="/long-term-stake/super">
                <SuperStake />
              </Route>
              <Route path="/bridge">
                <Bridge />
              </Route>
              <Route path="/voting">
                <Voting />
              </Route>

              {/* 404 */}
              <Route>
                <Error />
              </Route>
            </Switch>
          </Suspense>
        </Menu>
        <ToastListener />
      </Suspense>
    </Router>
  )
}

export default React.memo(App)
