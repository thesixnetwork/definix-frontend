import { provider as ProviderType } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import erc20 from 'config/abi/erc20.json'
import { getCaver } from './caver'
// import getRPCHalper from 'utils/getRPCHalper'
// import caver from '../klaytn/caver'

export const getContract = (provider: ProviderType, address: string) => {
  const caver = getCaver()
  return new caver.eth.Contract(erc20 as unknown as AbiItem, address)
  return new caver.klay.Contract(erc20 as unknown as AbiItem, address)
}

export const getCustomContract = (provider: ProviderType, abi: AbiItem, address: string) => {
  const caver = getCaver()
  return new caver.eth.Contract(abi, address)
}

export const getAllowance = async (
  lpContract: Contract,
  herodotusContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.methods.allowance(account, herodotusContract.options.address).call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getTokenBalance = async (
  provider: ProviderType,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const contract = getContract(provider, tokenAddress)
  try {
    const balance: string = await contract.methods.balanceOf(userAddress).call()
    return balance
  } catch (e) {
    return '0'
  }
}
