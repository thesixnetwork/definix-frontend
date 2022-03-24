import { HelmetProvider } from 'react-helmet-async'
import { BlockContextProvider } from 'contexts/BlockContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'

import React from 'react'
import { Provider } from 'react-redux'
import store from 'state'
import { ModalProvider } from '@fingerlabs/definixswap-uikit-v2'

import { createCaverJsReactRoot, CaverJsReactProvider } from '@sixnetwork/caverjs-react-core'
import { NetworkContextName } from './config/constants'
import getLibrary from './utils/getLibrary'
import { WalletContextProvider } from 'contexts/WalletContext'

const Web3ProviderNetwork = createCaverJsReactRoot(NetworkContextName)

const Providers: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <ModalProvider>
          <WalletContextProvider>
            <Web3ProviderNetwork getLibrary={getLibrary}>
              <CaverJsReactProvider getLibrary={getLibrary}>
                <HelmetProvider>
                  <BlockContextProvider>
                    <RefreshContextProvider>
                      {children}
                    </RefreshContextProvider>
                  </BlockContextProvider>
                </HelmetProvider>
              </CaverJsReactProvider>
            </Web3ProviderNetwork>
          </WalletContextProvider>
        </ModalProvider>
      </ThemeContextProvider>
    </Provider>
  )
}

export default Providers
