import {
  getDefinixProfileAddress,
  getDefinixRabbitsAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getTradingCompetRegisAddress,
} from 'utils/addressHelpers'
import { getContract } from 'utils/web3'
import profileABI from 'config/abi/definixProfile.json'
import definixRabbitsAbi from 'config/abi/definixRabbits.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import tradeCompetRegisAbi from 'config/abi/definixTradeCompetition.json'

export const getProfileContract = () => {
  return getContract(profileABI, getDefinixProfileAddress())
}

export const getDefinixRabbitContract = () => {
  return getContract(definixRabbitsAbi, getDefinixRabbitsAddress())
}

export const getTradeCompetRegisContract = () => {
  return getContract(tradeCompetRegisAbi, getTradingCompetRegisAddress())
}

export const getBunnyFactoryContract = () => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress())
}

export const getBunnySpecialContract = () => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress())
}

export default null
