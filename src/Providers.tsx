import { createTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { BlockContextProvider } from 'contexts/BlockContext'
import { LanguageContextProvider } from 'contexts/Localisation/languageContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { UseWalletProvider, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import React from 'react'
import { Provider } from 'react-redux'
import store from 'state'
import { ModalProvider } from 'uikit-dev'

const Providers: React.FC = ({ children }) => {
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
  const { setShowModal } = React.useContext(KlipModalContext())

  const onHiddenModal = () => {
    setShowModal(false)
  }
  window.onclick = (event) => {
    if (event.target === document.getElementById('customKlipModal')) {
      onHiddenModal()
    }
  }
  return (
    <Provider store={store}>
      <ThemeContextProvider>
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
