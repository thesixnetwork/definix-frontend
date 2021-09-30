import { getDeParamAddress } from 'utils/addressHelpers'
import deParamABI from 'config/abi/deParam.json'
import { getContract } from 'utils/caver'

const UseDeParam = async (key, defaultValue = '') => {
  const deParamContract = getContract(deParamABI, getDeParamAddress())

  const valuesResp = await deParamContract.methods.deParam(key).call()

  return valuesResp !== null && valuesResp !== undefined && valuesResp.toString() !== null
    ? valuesResp.toString()
    : defaultValue
}

export default UseDeParam
