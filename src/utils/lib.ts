import Web3 from 'web3'
import Caver from 'caver-js'
import { ContractOptions } from 'web3-eth-contract'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Caver.providers.HttpProvider(RPC_URL)

let caverInstance;
let web3Instance;
const getCaver = (provider?: any) => {
  if (!provider) {
    if (!caverInstance) {
      caverInstance = new Caver(httpProvider);
    }
    return caverInstance;
  }
  if (provider.isMetamask) {
    if (!web3Instance) {
      web3Instance = new Web3(provider);
    }
    return web3Instance;
  }
  if (!caverInstance) {
    caverInstance = new Caver(provider);
  }
  return window.caver || caverInstance
}

const getCaverKlay = (provider?: any) => {
  const library = getCaver(provider)
  return library.eth ? library.eth : library.klay;
}

const getContract = (provider: any, abi: any, address: string, contractOptions?: ContractOptions) => {
  return new (getCaverKlay(provider).Contract(abi, address, contractOptions))
}

export { getCaver, getCaverKlay, getContract }
