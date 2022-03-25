import { useContext, useEffect } from 'react'
import { WalletContext } from 'contexts/WalletContext'
import useKlipModal from './useKlipModal'

const useWallet = () => {
  const context = useContext(WalletContext)
  const [onPresentKlipModal, onDismissKlipModal] = useKlipModal()

  useEffect(() => {
    context.initKlip({
      show: () => onPresentKlipModal(),
      hide: () => onDismissKlipModal(),
    })
  })
  return context
}

export default useWallet
