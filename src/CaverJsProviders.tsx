import React from 'react'
import { createCaverJsReactRoot, CaverJsReactProvider } from '@sixnetwork/caverjs-react-core'
import { NetworkContextName } from 'config/constants'
import getLibrary from 'utils/getLibrary'

// swap-interface
const Web3ProviderNetwork = createCaverJsReactRoot(NetworkContextName)

const CaverJsProviders = ({ children }) => {
  return (
    <CaverJsReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>{children}</Web3ProviderNetwork>
    </CaverJsReactProvider>
  )
}

export default CaverJsProviders
