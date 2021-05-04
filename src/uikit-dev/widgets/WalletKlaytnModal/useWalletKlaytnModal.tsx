import React from 'react'
import { useModal } from '../Modal'
import ConnectModal from './ConnectModal'
import AccountModal from './AccountModal'

interface ReturnType {
  onPresentConnectKlaytnModal: () => void
  onPresentAccountKlaytnModal: () => void
}

const useWalletKlaytnModal = (logout: () => void, account?: string): ReturnType => {
  const [onPresentConnectKlaytnModal] = useModal(<ConnectModal />)
  const [onPresentAccountKlaytnModal] = useModal(<AccountModal account={account || ''} logout={logout} />)
  return { onPresentConnectKlaytnModal, onPresentAccountKlaytnModal }
}

export default useWalletKlaytnModal
