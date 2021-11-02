import React from 'react'
import ReactDOM from 'react-dom'
import { KlipModalProvider } from '@sixnetwork/klaytn-use-wallet'
import App from './App'
import Providers from './Providers'

ReactDOM.render(
  <KlipModalProvider>
    <Providers>
      <App />
    </Providers>
  </KlipModalProvider>,
  document.getElementById('root'),
)
