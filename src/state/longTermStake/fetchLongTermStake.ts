import BigNumber from 'bignumber.js'
import IKIP7 from '../../config/abi/IKIP7.json'
import multicall from '../../utils/multicall'
import { getContract } from '../../utils/caver'
import farmsConfig from '../../config/constants/farms'
import { getVFinix } from '../../utils/addressHelpers'

export const fetchFarmUserAllowances = async (account: string) => {
  const vFinix = getVFinix()

  const calls = farmsConfig.map((farm) => {
    return { address: vFinix, name: 'totalSupply', params: [] }
  })

  const totalSupply = await multicall(IKIP7.abi, calls)
  const parsedTotalSupply = totalSupply.map((_totalSupply) => {
    return new BigNumber('').toJSON()
  })
  return parsedTotalSupply
}
