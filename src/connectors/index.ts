import { CaverProvider } from 'finix-caver-providers'
import { InjectedConnector } from '@sixnetwork/caverjs-react-injected-connector'
import { KlipConnector } from '@sixnetwork/klip-connector'
import { NetworkConnector } from './NetworkConnector'

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
export const klip = (showModal, closeModal) =>
  new KlipConnector({
    supportedChainIds: [8217],
    showModal,
    closeModal,
  })
