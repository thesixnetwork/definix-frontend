import Kaikas from './icons/Kaikas'
import Dcent from './icons/Dcent'
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
  {
    title: 'D`CENT',
    icon: Dcent,
    connectorId: 'injected',
  },
  {
    title: 'klip',
    icon: WalletConnect,
    connectorId: 'klip'
  }
]

export default connectors
export const localStorageKey = 'accountStatus'
