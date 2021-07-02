import React from 'react'
import { ModalProvider } from 'uikit-dev'
import injected, { UseWalletProvider } from 'klaytn-use-wallet'
import { Provider } from 'react-redux'
import getRpcUrl from 'utils/getRpcUrl'
import { LanguageContextProvider } from 'contexts/Localisation/languageContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { BlockContextProvider } from 'contexts/BlockContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import store from 'state'
import { KlipModalContext } from './KlipModal'

const Providers: React.FC = ({ children }) => {
  const rpcUrl = getRpcUrl()
  const { setShowModal, showModal } = React.useContext(KlipModalContext)

  const onPresent = () => {
    setShowModal(true)
  }
  const onHiddenModal = () => {
    setShowModal(false)
  }
  window.onclick = function (event) {
    console.log('event.target ', event.target)
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
            }}
          >
            <BlockContextProvider>
              <RefreshContextProvider>
                <ModalProvider>{children}</ModalProvider>
              </RefreshContextProvider>
            </BlockContextProvider>
          </UseWalletProvider>
        </LanguageContextProvider>
      </ThemeContextProvider>
    </Provider>
  )
}

export default Providers
