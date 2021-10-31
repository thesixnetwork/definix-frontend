import React from 'react'
import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { Button, ButtonProps, ConnectorId, useWalletModal } from 'uikit-dev'
import { injected, klip } from 'connectors'
import { KlipModalContext } from "@sixnetwork/klaytn-use-wallet"
import useI18n from 'hooks/useI18n'

const UnlockButton: React.FC<ButtonProps> = props => {
  const { setShowModal, showModal } = React.useContext(KlipModalContext())
  const TranslateString = useI18n()
  const { account, activate, deactivate } = useCaverJsReact()
  const showModalKlip = () => {
    setShowModal(true)
  }
  const closeModalKlip = () => {
    setShowModal(false)
  }
  const handleLogin = (connectorId: ConnectorId) => {
    if (connectorId === "klip") {
      window.localStorage.setItem("connector","klip")
      return activate(klip(showModalKlip, closeModalKlip))
    }
    window.localStorage.setItem("connector", "injected")
    return activate(injected)


  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
