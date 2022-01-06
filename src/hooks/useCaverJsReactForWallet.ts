import React, { useCallback } from 'react';
import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { KlipModalContext } from "@sixnetwork/klaytn-use-wallet"
import { injected, klip } from 'connectors'

export default function useCaverJsReactForWallet(): {
  login: (connectorId: string) => void;
  logout: () => void;
} {
  const { setShowModal } = React.useContext(KlipModalContext())
  const { activate, deactivate } = useCaverJsReact()

  const showModalKlip = useCallback(() => {
    setShowModal(true)
  }, [setShowModal])
  const closeModalKlip = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const login = useCallback((connectorId: string) => {
    if (connectorId === 'klip') {
      window.localStorage.setItem('connector', 'klip')
      activate(klip(showModalKlip, closeModalKlip))
    } else {
      window.localStorage.setItem('connector', 'injected')
      activate(injected)
    }
  }, [activate, closeModalKlip, showModalKlip]);

  const logout = useCallback(() => {
    deactivate();
    window.localStorage.removeItem('userAccount')
  }, [deactivate]);

  return { login, logout };
}
