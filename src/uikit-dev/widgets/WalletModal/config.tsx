import Kaikas from './icons/Kaikas'
import MathWallet from './icons/MathWallet'
import TokenPocket from './icons/TokenPocket'
import TrustWallet from './icons/TrustWallet'
import WalletConnect from './icons/WalletConnect'
import BinanceChain from './icons/BinanceChain'
import { Config } from './types'

const connectors: Config[] = [
  {
    title: 'Kaikas',
    icon: Kaikas,
    connectorId: 'injected',
  },
]

export default connectors
export const localStorageKey = 'accountStatus'
