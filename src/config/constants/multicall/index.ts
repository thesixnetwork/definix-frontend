import MULTICALL_ABI from './abi.json'

const intMainnetId = parseInt(process.env.REACT_APP_MAINNET_ID || '')
const intTestnetId = parseInt(process.env.REACT_APP_TESTNET_ID || '')

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
  [intMainnetId]: process.env.REACT_APP_MULTICALL_ADDRESS_MAINNET || '',
  [intTestnetId]: process.env.REACT_APP_MULTICALL_ADDRESS_TESTNET || ''
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
