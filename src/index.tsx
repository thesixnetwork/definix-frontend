import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Providers from './Providers'
import { KlipModalProvider } from './KlipModal'

ReactDOM.render(
  <React.StrictMode>
    <KlipModalProvider>
    <Providers>
      <App />
    </Providers>
    </KlipModalProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
