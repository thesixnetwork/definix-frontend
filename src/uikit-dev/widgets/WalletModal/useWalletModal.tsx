import React from 'react'
import ConnectModalV2 from 'uikitV2/components/ConnectModalV2'
import { useModal } from '../Modal'
import AccountModal from './AccountModal'
import { Login } from './types'

interface ReturnType {
  onPresentConnectModal: () => void
  onPresentAccountModal: () => void
}

const useWalletModal = (login: Login, logout: () => void, account?: string): ReturnType => {
  const [onPresentConnectModal] = useModal(<ConnectModalV2 login={login} />)
  const [onPresentAccountModal] = useModal(<AccountModal account={account || ''} logout={logout} />)
  return { onPresentConnectModal, onPresentAccountModal }
}

export default useWalletModal
