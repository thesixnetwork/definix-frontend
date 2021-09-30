import React from 'react'
import { ModalProvider } from 'uikit-dev'
import injected, { UseWalletProvider, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { Provider } from 'react-redux'
import { LanguageProvider } from 'contexts/Localization'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { BlockContextProvider } from 'contexts/BlockContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import store from 'state'

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

  const onPresent = () => {
    setShowModal(true)
  }
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
        <LanguageProvider>
          <UseWalletProvider
            chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
            connectors={{
              injected,
              klip: { showModal: onPresent, closeModal: onHiddenModal },
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
        </LanguageProvider>
      </ThemeContextProvider>
    </Provider>
  )
}

export default Providers
