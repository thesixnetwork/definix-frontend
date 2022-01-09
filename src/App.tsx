import React, { lazy, Suspense, useEffect } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'

import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { Config } from 'definixswap-sdk'
import { useFetchProfile, useFetchPublicData } from 'state/hooks'
import { GlobalStyle, Loading } from '@fingerlabs/definixswap-uikit-v2'

import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'

import Menu from './components/Menu'
import ToastListener from './components/ToastListener'
import sdkConfig from './sdkconfig'

import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './views/Liquidity/redirects'
import RemoveLiquidity from './views/RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './views/RemoveLiquidity/redirects'
import { RedirectToSwap } from './views/Swap/redirects'

Config.configure(sdkConfig)

// Route-based code splitting
// Only pool is included in the main bucndle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Pools = lazy(() => import('./views/Pools'))
const NewFarms = lazy(() => import('./views/NewFarms'))
const Explore = lazy(() => import('./views/Explore'))
const Error = lazy(() => import('./views/Error'))
const MyInvestments = lazy(() => import('./views/MyInvestments'))
const LongTermStakeV2 = lazy(() => import('./views/LongTermStake_v2'))
const SuperStake = lazy(() => import('./views/LongTermStake_v2/SuperStake'))
const Bridge = lazy(() => import('./views/Bridge'))
const Swap = lazy(() => import('./views/Swap'))
const Liquidity = lazy(() => import('./views/Liquidity'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account, connect } = useWallet()
  // const { account, connector: connect } = useCaverJsReact()
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

  // const { account } = useCaverJsReact()
  // const { login } = useCaverJsReactForWallet()

  // // wallet
  // const checkConnector = (connector: string) => window.localStorage.getItem('connector') === connector
  // useEffect(() => {
  //   if (!account && window.localStorage.getItem('accountStatus') && checkConnector('injected')) {
  //     login('injected')
  //   } else if (
  //     !account &&
  //     window.localStorage.getItem('accountStatus') &&
  //     window.localStorage.getItem('userAccount') &&
  //     checkConnector('klip')
  //   ) {
  //     login('klip')
  //   }
  // }, [account, login])

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/">
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
            <Route exact path="/bridge">
              <Bridge />
            </Route>
            {/* <Route exact path="/" component={RedirectPathToSwapOnly} /> */}
            <Route exact path="/swap">
              <Swap />
            </Route>
            <Route exact path="/swap/:currencyIdA/:currencyIdB">
              <RedirectToSwap />
            </Route>
            <Route exact path="/swap/:currencyIdA">
              <RedirectToSwap />
            </Route>
            <Route exact strict path="/liquidity/add">
              <Liquidity />
            </Route>
            <Route exact path="/liquidity/add/:currencyIdA">
              <RedirectOldAddLiquidityPathStructure />
            </Route>
            <Route exact path="/liquidity/add/:currencyIdA/:currencyIdB">
              <RedirectDuplicateTokenIds />
            </Route>
            <Route exact strict path="/liquidity/remove/:currencyIdA/:currencyIdB">
              <RemoveLiquidity />
            </Route>
            <Route exact strict path="/liquidity/remove/:tokens">
              <RedirectOldRemoveLiquidityPathStructure />
            </Route>
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
