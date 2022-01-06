import multicall from '../utils/multicall'
import DEPARAM_ABI from '../constants/abis/deParam.json'
import {
  MULTICALL_ADDRESS,
  DEPARAM_ADDRESS,
} from '../constants'

const UseDeParam = async (chainId, key, defaultValue = '') => {
  const multicallContractAddress = MULTICALL_ADDRESS[chainId || parseInt(process.env.REACT_APP_CHAIN_ID || '0')]
  const deParamContractAddress = DEPARAM_ADDRESS[chainId || parseInt(process.env.REACT_APP_CHAIN_ID || '0')]

  const calls = [
    {
      address: deParamContractAddress,
      name: 'deParam',
      params: [key]
    },
  ]

  const [valuesResp] = await multicall(multicallContractAddress, DEPARAM_ABI, calls)

  // console.log(">>>>>>>>>>>>>>>>>>>>>>>> valuesResp = ", valuesResp.toString())

  return valuesResp !== null && valuesResp !== undefined && valuesResp.toString() !== null
    ? valuesResp.toString()
    : defaultValue
}

export default UseDeParam
