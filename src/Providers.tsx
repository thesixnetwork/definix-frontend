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

const Web3ProviderNetwork = createCaverJsReactRoot(NetworkContextName)

const Providers: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <CaverJsReactProvider getLibrary={getLibrary}>
          <HelmetProvider>
            <ThemeContextProvider>
              <BlockContextProvider>
                <RefreshContextProvider>
                  <ModalProvider>{children}</ModalProvider>
                </RefreshContextProvider>
              </BlockContextProvider>
            </ThemeContextProvider>
          </HelmetProvider>
        </CaverJsReactProvider>
      </Web3ProviderNetwork>
    </Provider>
  )
}

export default Providers
