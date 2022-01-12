import React from 'react'
import ReactDOM from 'react-dom'
import { Config } from 'definixswap-sdk'
import Caver from 'caver-js'

import App from './App'
import Providers from './Providers'

import './i18n'

// import ReactGA from 'react-ga'
// import TagManager from 'react-gtm-module'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import sdkConfig from './sdkconfig'

Config.configure(sdkConfig)
// ReactGA.initialize('G-L997LXLF8F')

// const tagManagerArgs = {
//   gtmId: 'GTM-WVFPW42',
// }
// TagManager.initialize(tagManagerArgs)
// if ('klaytn' in window) {
//   ;(window.klaytn as any).autoRefreshOnNetworkChange = false
// }

window.addEventListener('error', () => {
  localStorage?.removeItem('redux_localstorage_simple_lists')
})

// import getRPCHalper from 'utils/getRPCHalper'
// const rpcURL = process.env.REACT_APP_KLAYTN_RPC_URL;
// console.log("rpcURL = ", rpcURL);

window.addEventListener(
  'klaytn#initialized',
  () => {
    window.caver = new Caver(window.klaytn)
  },
  false,
)

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <>
        <ListsUpdater />
        <ApplicationUpdater />
        <TransactionUpdater />
        <MulticallUpdater />
      </>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)
