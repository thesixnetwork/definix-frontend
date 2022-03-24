import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import KlaytnWallet, { AvailableConnectors, WalletError } from 'klaytn-wallets'
import { useToast } from 'state/toasts/hooks';
import { useTranslation } from 'react-i18next';
import getLibrary from 'utils/getLibrary';
import useKlipModal, { renderKlipTimeFormat } from 'hooks/useKlipModal';

interface WalletState {
  account: string;
  connector: string;
  chainId: number;
  library: any;
  klaytn: any;
  activate: (connectorId: string) => Promise<void>
  deactivate: () => void
}

const WalletContext = createContext<WalletState>({
  account: null,
  connector: null,
  chainId: parseInt(process.env.REACT_APP_CHAIN_ID) || 1001,
  library: null,
  klaytn: null,
  activate: () => Promise.resolve(),
  deactivate: () => {
    return;
  },
})

const WalletContextProvider = ({ children }) => {
  const { t } = useTranslation()
  const [account, setAccount] = useState();
  const [connector, setConnector] = useState();
  const { toastError } = useToast()
  const wallet = useRef<KlaytnWallet>();

  const [onPresentKlipModal, onDismissKlipModal] = useKlipModal({
    onHide: () => {
      // wallet.closeKlip()
    },
  })

  const onActivate = useCallback(
    async (connectorId: string) => {
      try {
        if (wallet.current.isAvailable(connectorId)) {
          await wallet.current.activate(connectorId)
          setAccount(wallet.current.account)
          setConnector(wallet.current.connectorId)
        } else {
          toastError(t('Provider Error'))
        }
      } catch (e: any) {
        if (e.message === WalletError.USER_DENIED) {
          toastError(t('Authorization Error'))
        }
        console.error(e.message)
      }
    },
    [wallet],
  )

  const onDeactivate = useCallback(() => {
    wallet.current.deactivate()
    setAccount(wallet.current.account)
    setConnector(wallet.current.connectorId)
  }, [wallet])


  useEffect(() => {
    // dcent inapp browser 관련 처리
    setTimeout(() => {
      wallet.current = new KlaytnWallet([
        AvailableConnectors.KAIKAS,
        AvailableConnectors.KLIP,
        AvailableConnectors.METAMASK,
        AvailableConnectors.DCENT,
        AvailableConnectors.TOKENPOCKET,
      ]);
  
      wallet.current.initKlip(
        {
          renderTimeFormat(time: number) {
            return renderKlipTimeFormat(time)
          },
        },
        {
          show: () => onPresentKlipModal(),
          hide: () => onDismissKlipModal(),
        },
      )
  
      if (!wallet.current.isConnected()) {
        onActivate(wallet.current.connectorId)
      }
    }, 100);

  }, [])

  const library = useMemo(() => (window.caver ? getLibrary(window.klaytn) : undefined), [])
  const klaytn = useMemo(() => library?.provider || undefined, [library])

  return (
    <WalletContext.Provider value={{
      account,
      chainId: parseInt(process.env.REACT_APP_CHAIN_ID) || 1001,
      library,
      klaytn,
      connector,
      activate: onActivate,
      deactivate: onDeactivate,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export { WalletContext, WalletContextProvider }
