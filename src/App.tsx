import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'

import React, { lazy, Suspense, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'
import { Route, Router, Switch } from 'react-router-dom'
import { Config } from 'definixswap-sdk'
import { useFetchProfile, useFetchPublicData } from 'state/hooks'
import { ResetCSS } from 'uikit-dev'
import Info from 'views/Info/Info'
import Leaderboard from 'views/TradingChallenge/Leaderboard'
import TradingChallenge from 'views/TradingChallenge/TradingChallenge'

// swap-interface
import { Credentials, StringTranslations } from '@crowdin/crowdin-api-client'
import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { injected,klip } from 'connectors'
import { allLanguages, EN } from 'config/constants/localisation/languageCodes'
import AddLiquidity from 'views/AddLiquidity'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from 'views/AddLiquidity/redirects'
import Pool from 'views/Pool'
import PoolFinder from 'views/PoolFinder'
import RemoveLiquidity from 'views/RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from 'views/RemoveLiquidity/redirects'
import Swap from 'views/Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from 'views/Swap/redirects'
import styled from 'styled-components'
import sdkConfig from './sdkconfig'
import GlobalStyle from './style/Global'
import history from './routerHistory'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import Menu from './components/Menu'

// import WaitingPage from 'uikit-dev/components/WaitingPage'
Config.configure(sdkConfig)
ReactGA.initialize('G-L997LXLF8F')

const tagManagerArgs = {
  gtmId: 'GTM-WVFPW42',
}
TagManager.initialize(tagManagerArgs)
// ReactGA.initialize(process.env.REACT_APP_GANALYTIC)
//
// const tagManagerArgs = {
//   gtmId: process.env.REACT_APP_GTAG,
// }
// TagManager.initialize(tagManagerArgs)

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Pools = lazy(() => import('./views/Pools'))
const Farms = lazy(() => import('./views/Farms'))
const NewFarms = lazy(() => import('./views/NewFarms'))
const Explore = lazy(() => import('./views/Explore'))
const NotFound = lazy(() => import('./views/NotFound'))
const AirdropKlay = lazy(() => import('./views/AirdropKlay'))
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

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  // overflow-x: hidden;
  height: 100%;
`

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
    // console.log(`%c App.tsx/useEffect fired`, 'background: coral')
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

  // swap-interface

  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(undefined)
  const [translations, setTranslations] = useState<Array<any>>([])
  const apiKey = `${process.env.REACT_APP_CROWDIN_APIKEY}`
  const projectId = parseInt(`${process.env.REACT_APP_CROWDIN_PROJECTID}`)
  const fileId = 6

  const credentials: Credentials = {
    token: apiKey,
  }

  const stringTranslationsApi = new StringTranslations(credentials)

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem('definixSwapLanguage')
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
    } else {
      setSelectedLanguage(EN)
    }
  }, [])

  const fetchTranslationsForSelectedLanguage = async () => {
    stringTranslationsApi
      .listLanguageTranslations(projectId, selectedLanguage.code, undefined, fileId, 200)
      .then((translationApiResponse) => {
        if (translationApiResponse.data.length < 1) {
          setTranslations(['error'])
        } else {
          setTranslations(translationApiResponse.data)
        }
      })
      .then(() => setTranslatedLanguage(selectedLanguage))
      .catch((error) => {
        setTranslations(['error'])
        console.error(error)
      })
  }

  // remove account temporarily
  // const { account, activate } = useCaverJsReact()
  const { activate } = useCaverJsReact()
  const { setShowModal, showModal } = React.useContext(KlipModalContext())
 
  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus') && checkConnector("injected")) {
      activate(injected)
    }else if (!account && window.localStorage.getItem('accountStatus') && window.localStorage.getItem('userAccount') && checkConnector("klip")){
      activate(klip(()=>{setShowModal(true)}, ()=>{setShowModal(false)}))
    }

  }, [account, activate,setShowModal])
  // const checkConnector = (connector: string) => window.localStorage.getItem('connector') === connector

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslationsForSelectedLanguage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage])

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/trading-challenge">
              <TradingChallenge />
            </Route>
            <Route path="/leaderboard">
              <Leaderboard />
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
            <Route path="/rebalancing">
              <Explore />
            </Route>
            <Route path="/AirdropKlay">
              <AirdropKlay />
            </Route>
            <Route path="/newFarm">
              <NewFarms />
            </Route>

            {/* swap-interface */}
            <Route exact strict path="/swap" component={Swap} />
            <Route exact path="/swap/:currencyIdA/:currencyIdB" component={RedirectToSwap} />
            <Route exact path="/swap/:currencyIdA" component={RedirectToSwap} />
            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact strict path="/liquidity" component={Pool} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

            {/* <Route path="/xxx">
              <WaitingPage pageName="XXX" openDate="Tue Mar 30 2021 08:00:00 GMT+0700 (Indochina Time)" />
            </Route> */}

            {/* Redirection: These old routes are still used in the code base */}
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
            <Route component={RedirectPathToSwapOnly} />

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
      {/* <GlobalCheckBullHiccupClaimStatus /> */}
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

export default React.memo(App)
