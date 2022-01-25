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
const getCaver = () => {
  // console.log("httpProvider = ", httpProvider)
  // @ts-ignore
  const caver = window.caver || new Caver(httpProvider)
  return caver
}
const getContract = (abi: any, address: string, contractOptions?: ContractOptions) => {
  // @ts-ignore
  const caver = window.caver || getCaver()
  return new caver.klay.Contract(abi as unknown as AbiItem, address, contractOptions)
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

export { getWeb3Contract, getWeb3, getCaver, getContract, httpProvider }

// import Caver from 'caver-js'
// // import { HttpProviderOptions } from 'web3-core-helpers'
// import { AbiItem } from 'web3-utils'
// import { ContractOptions } from 'web3-eth-contract'
// import getRpcUrl from 'utils/getRpcUrl'

// const RPC_URL = getRpcUrl()
// const httpProvider = new Caver.providers.HttpProvider(RPC_URL, { timeout: 10000 })
// // eslint-disable-next-line
// declare const window: any;
// const baseCaver = new Caver(window.klaytn)
// const Contract = baseCaver.contract

// /**
//  * Provides a web3 instance using our own private provider httpProver
//  */
// const getCaver = () => {
//   const caver = window.caver || new Caver(httpProvider)
//   return caver
// }
// const getCaverContract = (address: string, abi: any, contractOptions?: ContractOptions) => {
//   const caver = getCaver()
//   // eslint-disable-next-line
//   return new caver.klay.Contract(abi as unknown as AbiItem, address, contractOptions)
// }

// export { getCaver, getCaverContract, Contract }
