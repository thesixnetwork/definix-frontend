import { createTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { BlockContextProvider } from 'contexts/BlockContext'
import { LanguageContextProvider } from 'contexts/Localisation/languageContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import injected, { UseWalletProvider } from 'klaytn-use-wallet'
import React from 'react'
import { Provider } from 'react-redux'
import store from 'state'
import { ModalProvider } from 'uikit-dev'
import getRpcUrl from 'utils/getRpcUrl'

const Providers: React.FC = ({ children }) => {
  const rpcUrl = getRpcUrl()

  const muiTheme = createTheme({
    palette: {
      primary: {
        main: '#1587C9',
      },

      secondary: {
        main: '#0973B9',
      },
    },
  })

  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <LanguageContextProvider>
          <UseWalletProvider
            chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
            connectors={{
              injected,
            }}
          >
            <BlockContextProvider>
              <RefreshContextProvider>
                <ModalProvider>
                  <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
                </ModalProvider>
              </RefreshContextProvider>
            </BlockContextProvider>
          </UseWalletProvider>
        </LanguageContextProvider>
      </ThemeContextProvider>
    </Provider>
  )
}

export default Providers
