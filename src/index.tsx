import React from 'react'
import ReactDOM from 'react-dom'
import { Config } from 'definixswap-sdk'
import Caver from 'caver-js'

import App from './App'
import Providers from './Providers'

import './i18n'

import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import sdkConfig from './sdkconfig'

Config.configure(sdkConfig)

window.addEventListener('error', () => {
  localStorage?.removeItem('redux_localstorage_simple_lists')
});

const { klaytn } = window as any;
if (klaytn && klaytn.isKaikas === true && klaytn.networkVersion == process.env.REACT_APP_CHAIN_ID) {
  // window.caver = new Caver(window.klaytn)
} else {
  window.caver = new Caver(new Caver.providers.HttpProvider(process.env.REACT_APP_NETWORK_URL))
}


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
