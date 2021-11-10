import Metamask from './icons/Metamask'
import Dcent from './icons/Dcent'
import MathWallet from './icons/MathWallet'
import TokenPocket from './icons/TokenPocket'
import TrustWallet from './icons/TrustWallet'
import WalletConnect from './icons/WalletConnect'
import BinanceChain from './icons/BinanceChain'
import { Config } from './types'

const connectors: Config[] = [
  {
    title: 'Metamask',
    icon: Metamask,
    connectorId: 'injected',
  },
  {
    title: 'D`CENT',
    icon: Dcent,
    connectorId: 'injected',
  },
  {
    title: 'TokenPocket',
    icon: TokenPocket,
    connectorId: 'injected',
  },
  {
    title: 'TrustWallet',
    icon: TrustWallet,
    connectorId: 'injected',
  },
  {
    title: 'MathWallet',
    icon: MathWallet,
    connectorId: 'injected',
  },
  {
    title: 'WalletConnect',
    icon: WalletConnect,
    connectorId: 'walletconnect',
  },
  {
    title: 'Binance Chain Wallet',
    icon: BinanceChain,
    connectorId: 'bsc',
  },
]

export default connectors
export const localStorageKey = 'accountStatus'
