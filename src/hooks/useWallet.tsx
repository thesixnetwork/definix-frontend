import { useContext } from 'react'
import { WalletContext } from 'contexts/WalletContext'

const useWallet = () => {
  return useContext(WalletContext)
}

export default useWallet
