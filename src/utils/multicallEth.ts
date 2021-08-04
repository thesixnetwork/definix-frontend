import { AbiItem } from 'web3-utils'
import { getCaver } from 'utils/caver'
import MultiCallAbi from 'config/abi/Multicall.json'
import { getMulticallAddress } from 'utils/addressHelpers'

const multicall = async (address: string) => {
  const caver = getCaver()
  const multi = new caver.klay.Contract(MultiCallAbi as unknown as AbiItem, getMulticallAddress())

  const res = await multi.methods.getEthBalance(address).call()
  return res
}

export default multicall
