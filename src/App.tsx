import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import React, { lazy, Suspense, useEffect } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { useFetchProfile, useFetchPublicData } from 'state/hooks'
import { Modal, ResetCSS } from 'uikit-dev'
import Info from 'views/Info/Info'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'
import ToastListener from './components/ToastListener'
import history from './routerHistory'
import GlobalStyle from './style/Global'
import Flip from './uikit-dev/components/Flip'
import GlobalCheckBullHiccupClaimStatus from './views/Collectibles/components/GlobalCheckBullHiccupClaimStatus'
// import WaitingPage from 'uikit-dev/components/WaitingPage'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Pools = lazy(() => import('./views/Pools'))
const Farms = lazy(() => import('./views/Farms'))
const NotFound = lazy(() => import('./views/NotFound'))
// const Lottery = lazy(() => import('./views/Lottery'))
// const Ifos = lazy(() => import('./views/Ifos'))
// const Collectibles = lazy(() => import('./views/Collectibles'))
// const Teams = lazy(() => import('./views/Teams'))
// const Team = lazy(() => import('./views/Teams/Team'))
// const Profile = lazy(() => import('./views/Profile'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account, connect } = useWallet()

  // const [isPhrase1, setIsPhrase1] = useState(false)
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

  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  useEffect(() => {
    console.warn = () => null
  }, [])

  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect('injected')
    }
  }, [account, connect])

  useFetchPublicData()
  useFetchProfile()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Redirect to="/dashboard" />
            </Route>
            <Route path="/dashboard">
              <Home />
            </Route>
            <Route path="/pool">
              <Pools />
            </Route>
            <Route path="/farm">
              <Farms />
            </Route>
            <Route path="/info">
              <Info />
            </Route>
            {/* <Route path="/xxx">
              <WaitingPage pageName="XXX" openDate="Tue Mar 30 2021 08:00:00 GMT+0700 (Indochina Time)" />
            </Route> */}

            {/* <Route path="/lottery">
              <Lottery />
            </Route>
            <Route path="/ifo">
              <Ifos />
            </Route>
            <Route path="/collectibles">
              <Collectibles />
            </Route>
            <Route exact path="/teams">
              <Teams />
            </Route>
            <Route path="/teams/:id">
              <Team />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route> */}

            {/* Redirect */}
            {/* <Route path="/staking">
              <Redirect to="/pools" />
            </Route>
            <Route path="/syrup">
              <Redirect to="/pools" />
            </Route>
            <Route path="/nft">
              <Redirect to="/collectibles" />
            </Route> */}

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
      <ToastListener />
      <GlobalCheckBullHiccupClaimStatus />
      {/* !isPhrase1 && (
        <div
          style={{
            position: 'fixed',
            zIndex: 1,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
          tabIndex={0}
          role="button"
          onClick={(e) => {
            e.preventDefault()
          }}
          onKeyDown={(e) => {
            e.preventDefault()
          }}
        >
          <div
            style={{
              overflow: 'auto',
              outline: 0,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              position: 'absolute',
              width: '90%',
              maxHeight: '80%',
              backgroundColor: 'white',
              borderRadius: '8px',
            }}
          >
            <DateModal date={phrase1TimeStamp} />
          </div>
        </div>
      ) */}
    </Router>
  )
}

const DateModal = ({ date }) => {
  return (
    <Modal title="" hideCloseButton isRainbow>
      <div>
        <Flip date={date} />
      </div>
    </Modal>
  )
}

export default React.memo(App)
