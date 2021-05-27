import Caver from 'caver-js'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Caver.providers.HttpProvider(RPC_URL)

/**
 * Provides a caver instance using our own private provider httpProver
 */
const getCaver = () => {
  // console.log("httpProvider = ", httpProvider)
  const caver = new Caver(httpProvider)
  return caver
}
const getContract = (abi: any, address: string, contractOptions?: ContractOptions) => {
  const caver = getCaver()
  return new caver.klay.Contract(abi as unknown as AbiItem, address, contractOptions)
}

export { getCaver, getContract, httpProvider }
