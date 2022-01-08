import { getDeParamAddress } from 'utils/addressHelpers'
import deParamABI from 'config/abi/deParam.json'
import { getContract } from 'utils/caver'

import DEPARAM_ABI from 'config/constants/abis/deParam.json'
import { MULTICALL_ADDRESS, DEPARAM_ADDRESS } from 'config/constants'

import { multicallForExchange } from '../utils/multicall'

const UseDeParam = async (key, defaultValue = '') => {
  const deParamContract = getContract(deParamABI, getDeParamAddress())

  const valuesResp = await deParamContract.methods.deParam(key).call()

  // console.log(">>>>>>>>>>>>>>>>>>>>>>>> valuesResp = ", valuesResp.toString())

  return valuesResp !== null && valuesResp !== undefined && valuesResp.toString() !== null
    ? valuesResp.toString()
    : defaultValue
}

export default UseDeParam

export const UseDeParamForExchange = async (chainId, key, defaultValue = '') => {
  const multicallContractAddress = MULTICALL_ADDRESS[chainId || parseInt(process.env.REACT_APP_CHAIN_ID || '0')]
  const deParamContractAddress = DEPARAM_ADDRESS[chainId || parseInt(process.env.REACT_APP_CHAIN_ID || '0')]

  const calls = [
    {
      address: deParamContractAddress,
      name: 'deParam',
      params: [key],
    },
  ]

  const [valuesResp] = await multicallForExchange(multicallContractAddress, DEPARAM_ABI, calls)

  // console.log(">>>>>>>>>>>>>>>>>>>>>>>> valuesResp = ", valuesResp.toString())

  return valuesResp !== null && valuesResp !== undefined && valuesResp.toString() !== null
    ? valuesResp.toString()
    : defaultValue
}
