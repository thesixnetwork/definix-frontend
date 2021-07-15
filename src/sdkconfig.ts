const chainId = process.env.REACT_APP_CHAIN_ID || ''
const mainnetId = process.env.REACT_APP_MAINNET_ID || ''
const testnetId = process.env.REACT_APP_TESTNET_ID || ''
const isMainnet = chainId === mainnetId
// const config: ConfigInterface = {
const config = {
  factoryAddress: isMainnet
    ? process.env.REACT_APP_MAINNET_FACTORY_ADDRESS
    : process.env.REACT_APP_TESTNET_FACTORY_ADDRESS,
  initCodeHash: isMainnet ? process.env.REACT_APP_MAINNET_INIT_CODE_HASH : process.env.REACT_APP_TESTNET_INIT_CODE_HASH,
  mainnetId: parseInt(mainnetId) || 0,
  testnetId: parseInt(testnetId) || 0,
  mainnetToken: {
    address: process.env.REACT_APP_MAINNET_WRAPPED_TOKEN_ADDRESS || '',
    decimals: parseInt(process.env.REACT_APP_MAINNET_WRAPPED_TOKEN_DECIMALS || '') || 0,
    symbol: process.env.REACT_APP_MAINNET_WRAPPED_TOKEN_SYMBOL || '',
    name: process.env.REACT_APP_MAINNET_WRAPPED_TOKEN_NAME || '',
  },
  testnetToken: {
    address: process.env.REACT_APP_TESTNET_WRAPPED_TOKEN_ADDRESS || '',
    decimals: parseInt(process.env.REACT_APP_TESTNET_WRAPPED_TOKEN_DECIMALS || '') || 0,
    symbol: process.env.REACT_APP_TESTNET_WRAPPED_TOKEN_SYMBOL || '',
    name: process.env.REACT_APP_TESTNET_WRAPPED_TOKEN_NAME || '',
  },
}

export default config
