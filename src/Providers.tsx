import { createTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { BlockContextProvider } from 'contexts/BlockContext'
import { LanguageContextProvider } from 'contexts/Localisation/Provider'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'

import injected, { UseWalletProvider, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import React from 'react'
import { Provider } from 'react-redux'
import store from 'state'
import { ModalProvider as OldModalProvider } from 'uikit-dev'
import { ModalProvider } from 'definixswap-uikit'

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
        <LanguageContextProvider>
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
                  <OldModalProvider>
                    <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
                  </OldModalProvider>
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
