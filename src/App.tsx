import React, { lazy, Suspense, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Helmet } from 'react-helmet-async'

import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { Config } from 'definixswap-sdk'
import { useFetchProfile, useFetchPublicData, usePriceFinixUsd } from 'state/hooks'
import { GlobalStyle, Loading } from '@fingerlabs/definixswap-uikit-v2'

import useWallet from 'hooks/useWallet'
import { ROUTES } from 'config/constants/routes'
import Menu from './components/Menu'
import ToastListener from './components/ToastListener'
import sdkConfig from './sdkconfig'

import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './views/Liquidity/redirects'
import RemoveLiquidity from './views/RemoveLiquidity'
import { RedirectToSwap } from './views/Swap/redirects'

Config.configure(sdkConfig)

// Route-based code splitting
// Only pool is included in the main bucndle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Voting = lazy(() => import('./views/Voting_v2'))
// const VotingPrev = lazy(() => import('./views/Voting'))
const Pools = lazy(() => import('./views/Pools'))
const Farms = lazy(() => import('./views/Farms'))
const RebalancingFarms = lazy(() => import('./views/RebalancingFarms'))
const Error = lazy(() => import('./views/Error'))
const MyInvestments = lazy(() => import('./views/MyInvestments'))
const LongTermStake = lazy(() => import('./views/LongTermStake'))
const SuperStake = lazy(() => import('./views/LongTermStake/SuperStake'))
const Bridge = lazy(() => import('./views/Bridge'))
const Swap = lazy(() => import('./views/Swap'))
const Liquidity = lazy(() => import('./views/Liquidity'))
const LiquidityList = lazy(() => import('./views/LiquidityList'))
const PoolFinder = lazy(() => import('./views/PoolFinder'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account, connect } = useWallet()
  const checkConnector = (connector: string) => window.localStorage.getItem('connector') === connector

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

  useFetchPublicData()
  useFetchProfile()

  const finixPrice = usePriceFinixUsd()

  return (
    <BrowserRouter>
      <Helmet>
        <title>Definix{!finixPrice || !account ? '' : ` - ${finixPrice?.toFixed(4)} FINIX/USD`}</title>
      </Helmet>
      <GlobalStyle />
      <Menu finixPrice={finixPrice?.toFixed(4)}>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path={ROUTES.HOME}>
              <Home />
            </Route>
            <Route path={ROUTES.POOL}>
              <Pools />
            </Route>
            <Route path={ROUTES.FARM}>
              <Farms />
            </Route>
            <Route path={ROUTES.REBALANCING}>
              <RebalancingFarms />
            </Route>
            <Route path={ROUTES.MY_INVESTMENT}>
              <MyInvestments />
            </Route>
            <Route path={ROUTES.LONG_TERM_STAKE}>
              <LongTermStake />
            </Route>
            <Route path={ROUTES.SUPER_STAKE}>
              <SuperStake />
            </Route>
            <Route exact path={ROUTES.BRIDGE}>
              <Bridge />
            </Route>
            <Route path="/voting">
                <Voting />
              </Route>
              {/* <Route path="/voting_prev">
                <VotingPrev />
              </Route> */}
            {/* <Route exact path="/" component={RedirectPathToSwapOnly} /> */}
            <Route exact path={ROUTES.SWAP}>
              <Swap />
            </Route>
            <Route exact path={ROUTES.SWAP_REDIRECT_AB}>
              <RedirectToSwap />
            </Route>
            <Route exact path={ROUTES.SWAP_REDIRECT_A}>
              <RedirectToSwap />
            </Route>
            <Route exact strict path={ROUTES.LIQUIDITY_ADD}>
              <Liquidity />
            </Route>
            <Route exact strict path={ROUTES.LIQUIDITY_LIST}>
              <LiquidityList />
            </Route>
            <Route exact path={ROUTES.LIQUIDITY_ADD_REDIRECT_A}>
              <RedirectOldAddLiquidityPathStructure />
            </Route>
            <Route exact path={ROUTES.LIQUIDITY_ADD_REDIRECT_AB}>
              <RedirectDuplicateTokenIds />
            </Route>
            <Route exact strict path={ROUTES.LIQUIDITY_REMOVE_REDIRECT_AB}>
              <RemoveLiquidity />
            </Route>
            {/* <Route exact strict path={ROUTES.LIQUIDITY_REMOVE_REDIRECT_TOKENS}>
              <RedirectOldRemoveLiquidityPathStructure />
            </Route> */}
            <Route exact strict path={ROUTES.LIQUIDITY_POOL_FINDER}>
              <PoolFinder />
            </Route>
            {/* <Route path="/voting">
              <Voting />
            </Route> */}
            {/* 404 */}
            <Route>
              <Error />
            </Route>
          </Switch>
        </Suspense>
      </Menu>
      <ToastListener />
    </BrowserRouter>
  )
}

export default React.memo(App)
