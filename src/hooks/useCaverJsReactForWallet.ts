import React, { useCallback } from 'react'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { injected, klip } from 'connectors'
import useWallet from './useWallet'

export default function useCaverJsReactForWallet(): {
  login: (connectorId: string) => void
  logout: () => void
} {
  const { setShowModal } = React.useContext(KlipModalContext())
  const { activate, deactivate } = useWallet()

  const showModalKlip = useCallback(() => {
    setShowModal(true)
  }, [setShowModal])
  const closeModalKlip = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const login = useCallback(
    (connectorId: string) => {
      if (connectorId === 'klip') {
        window.localStorage.setItem('connector', 'klip')
        activate(klip(showModalKlip, closeModalKlip))
      } else {
        window.localStorage.setItem('connector', 'injected')
        activate(injected)
      }
    },
    [activate, closeModalKlip, showModalKlip],
  )

  const logout = useCallback(() => {
    deactivate()
    window.localStorage.removeItem('userAccount')
  }, [deactivate])

  return { login, logout }
}
