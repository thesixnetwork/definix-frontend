import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import Caver from 'caver-js'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Caver.providers.HttpProvider(RPC_URL)
const web3HttpProvider = new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_NODE, {
  timeout: 10000,
} as HttpProviderOptions)

/**
 * Provides a caver instance using our own private provider httpProver
 */
let caverInstance
const getCaver = () => {
  if ((window as any).ethereum) {
    return new Web3((window as any).ethereum)
  } else if ((window as any).klaytn && (window as any).klaytn.networkVersion == process.env.REACT_APP_CHAIN_ID) {
    return window.caver
  } else {
    if (!caverInstance) {
      caverInstance = new Caver(httpProvider)
    }
    return caverInstance
  }
  // const caver = window.caver || new Caver(httpProvider)
  // return caver
}

const getCaverKlay = () => {
  return getCaver().eth ? getCaver().eth : getCaver().klay
}

const getContract = (abi: any, address: string, contractOptions?: ContractOptions) => {
  const { Contract } = getCaverKlay()
  return new Contract(abi as unknown as AbiItem, address, contractOptions)
}

/**
 * Provides a web3 instance using our own private provider httpProver
 */
const getWeb3 = () => {
  const web3 = new Web3(web3HttpProvider)
  return web3
}
const getWeb3Contract = (abi: any, address: string, contractOptions?: ContractOptions) => {
  const web3 = getWeb3()
  return new web3.eth.Contract(abi as unknown as AbiItem, address, contractOptions)
}

export { getWeb3Contract, getWeb3, getCaver, getContract, getCaverKlay, httpProvider }
