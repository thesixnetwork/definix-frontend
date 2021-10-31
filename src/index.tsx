import React from 'react'
import ReactDOM from 'react-dom'
import { KlipModalProvider } from '@sixnetwork/klaytn-use-wallet'
import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'
import { Config } from 'definixswap-sdk'
import sdkConfig from 'sdkconfig'
import CaverJsProviders from 'CaverJsProviders'
import App from './App'
import Providers from './Providers'

import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'

import 'inter-ui'
import './i18n'

// ReactGA.initialize(process.env.REACT_APP_GANALYTIC || "");
//
// const tagManagerArgs = {
//   gtmId: process.env.REACT_APP_GTAG || "",
// };
// TagManager.initialize(tagManagerArgs);

Config.configure(sdkConfig)
ReactGA.initialize('G-L997LXLF8F')

const tagManagerArgs = {
  gtmId: 'GTM-WVFPW42',
}
TagManager.initialize(tagManagerArgs)

if ('klaytn' in window) {
  (window.klaytn as any).autoRefreshOnNetworkChange = false
}

window.addEventListener('error', () => {
  localStorage?.removeItem('redux_localstorage_simple_lists')
})

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <KlipModalProvider>
      <Providers>
        <CaverJsProviders>
          <Updaters />
          <App />
        </CaverJsProviders>
      </Providers>
    </KlipModalProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
