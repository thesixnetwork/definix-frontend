import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import getRPCHalper from 'utils/getRPCHalper'

/**
 * Provides a web3 instance using our own private provider httpProver
 */
const getWeb3 = async() => {

  const httpProvider = new Web3.providers.HttpProvider(await getRPCHalper(), { timeout: 10000 } as HttpProviderOptions)
  
  const web3 = new Web3(httpProvider)
  return web3
}
const getContract = async(abi: any, address: string, contractOptions?: ContractOptions) => {
  const web3 = await getWeb3()
  return new web3.eth.Contract((abi as unknown) as AbiItem, address, contractOptions)
}

export { getWeb3, getContract }
