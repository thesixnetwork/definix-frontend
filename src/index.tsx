import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';
import App from './App'
import Providers from './Providers'

import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import 'inter-ui'
import './i18n'


ReactGA.initialize('G-L997LXLF8F');

const tagManagerArgs = {
  gtmId: 'GTM-WVFPW42',
};
TagManager.initialize(tagManagerArgs);
// ReactGA.initialize(process.env.REACT_APP_GANALYTIC || "");
// 
// const tagManagerArgs = {
//   gtmId: process.env.REACT_APP_GTAG || "",
// };
// TagManager.initialize(tagManagerArgs);

if ('ethereum' in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false
}

window.addEventListener('error', () => {
   localStorage?.removeItem('redux_localstorage_simple_lists')
})


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

