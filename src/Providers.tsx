import { HelmetProvider } from 'react-helmet-async'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'

import React from 'react'
import { Provider } from 'react-redux'
import store from 'state'
import { ModalProvider } from '@fingerlabs/definixswap-uikit-v2'

import { WalletContextProvider } from 'contexts/WalletContext'

const Providers: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <WalletContextProvider>
        <ThemeContextProvider>
          <ModalProvider>
            <HelmetProvider>
              <RefreshContextProvider>{children}</RefreshContextProvider>
            </HelmetProvider>
          </ModalProvider>
        </ThemeContextProvider>
      </WalletContextProvider>
    </Provider>
  )
}

export default Providers
