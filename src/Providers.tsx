import { BlockContextProvider } from 'contexts/BlockContext'
import { LanguageContextProvider } from 'contexts/Localisation/languageContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { ModalProvider } from 'uikit-dev'
import bsc, { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import React from 'react'
import { Provider } from 'react-redux'
import getRpcUrl from 'utils/getRpcUrl'
import store from 'state'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import muiTheme from 'uikitV2/muiTheme'

const Providers: React.FC = ({ children }) => {
  const rpcUrl = getRpcUrl()

  return (
    <Provider store={store}>
      <ThemeContextProvider>
      <MuiThemeProvider theme={muiTheme}>
        <LanguageContextProvider>
          <UseWalletProvider
            chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
            connectors={{
              walletconnect: { rpcUrl },
              bsc,
            }}
          >
            <BlockContextProvider>
              <RefreshContextProvider>
                <ModalProvider>{children}</ModalProvider>
              </RefreshContextProvider>
            </BlockContextProvider>
          </UseWalletProvider>
        </LanguageContextProvider>
        </MuiThemeProvider>
      </ThemeContextProvider>
    </Provider>
  )
}

export default Providers
