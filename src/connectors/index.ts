import { CaverProvider } from 'finix-caver-providers'
import { InjectedConnector } from '@sixnetwork/caverjs-react-injected-connector'
import { KlipConnector } from '@sixnetwork/klip-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import { PortisConnector } from '@web3-react/portis-connector'

// import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'

// import { BscConnector } from './bsc/bscConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
})

let networkLibrary: CaverProvider | undefined
export function getNetworkLibrary(): CaverProvider {
  // eslint-disable-next-line no-return-assign
  return (networkLibrary = networkLibrary ?? new CaverProvider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [8217, 1001],
})
export const klip =(showModal,closeModal)=> new KlipConnector({
  supportedChainIds: [8217],
  showModal,
  closeModal
})
// export const bsc = new BscConnector({ supportedChainIds: [56] })
// 
// // mainnet only
// export const walletconnect = new WalletConnectConnector({
//   rpc: { 1: NETWORK_URL },
//   bridge: 'https://bridge.walletconnect.org',
//   qrcode: true,
//   pollingInterval: 15000,
// })
// 
// // mainnet only
// export const fortmatic = new FortmaticConnector({
//   apiKey: FORMATIC_KEY ?? '',
//   chainId: 1,
// })
// 
// // mainnet only
// export const portis = new PortisConnector({
//   dAppId: PORTIS_ID ?? '',
//   networks: [1],
// })
// 
// // mainnet only
// export const walletlink = new WalletLinkConnector({
//   url: NETWORK_URL,
//   appName: 'Uniswap',
//   appLogoUrl:
//     'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg',
// })
