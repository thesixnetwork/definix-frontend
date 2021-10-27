import React from 'react'
import ReactDOM from 'react-dom'
import { KlipModalProvider } from '@sixnetwork/klaytn-use-wallet'
import { LanguageProvider } from 'contexts/Localisation/Context'
import App from './App'
import Providers from './Providers'

ReactDOM.render(
  <React.StrictMode>
    <LanguageProvider>
      <KlipModalProvider>
        <Providers>
          <App />
        </Providers>
      </KlipModalProvider>
    </LanguageProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
