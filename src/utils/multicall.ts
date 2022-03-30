import { AbiItem } from 'web3-utils'
import { Interface } from '@ethersproject/abi'
import { getCaver, getCaverKlay } from 'utils/caver'
import MultiCallAbi from 'config/abi/Multicall.json'
import { getMulticallAddress } from 'utils/addressHelpers'

interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (exemple: balanceOf)
  params?: any[] // Function params
}

const multicall = async (abi: any[], calls: Call[]) => {
  const { Contract } = getCaverKlay()

  const multi = new Contract(MultiCallAbi as unknown as AbiItem, getMulticallAddress())
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}

export const multicallEth = async (account: string) => {
  const { Contract } = getCaverKlay()
  const multi = new Contract(MultiCallAbi as unknown as AbiItem, getMulticallAddress())
  const response = await multi.methods.getEthBalance(account).call()
  return response
}

export default multicall

interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (exemple: balanceOf)
  params?: any[] // Function params
}

export const multicallForExchange = async (address: string, abi: any[], calls: Call[]) => {
  const caver = await getCaver()
  const multi = new caver.klay.Contract(MultiCallAbi as unknown as AbiItem, address)
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}
