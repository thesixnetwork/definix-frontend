export default {
  name: 'definixswap',
  timestamp: '2020-08-25T15:41:29.665Z',
  version: {
    major: 1,
    minor: 3,
    patch: 1,
  },
  tags: {},
  logoURI: '/images/coins/wbnb.png',
  keywords: ['definix', 'default'],
  tokens: [
    {
      name: 'FINIX',
      symbol: 'FINIX',
      address: process.env.REACT_APP_FINIX_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/finix.png',
    },
    {
      name: 'SIX',
      symbol: 'SIX',
      address: process.env.REACT_APP_SIX_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/six.png',
    },
    {
      name: 'oUSDT',
      symbol: 'oUSDT',
      address: process.env.REACT_APP_OUSDT_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/OUSDT.png',
    },
    {
      name: 'KDAI',
      symbol: 'KDAI',
      address: process.env.REACT_APP_KDAI_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/KDAI.png',
    },
    {
      name: 'KETH',
      symbol: 'KETH',
      address: process.env.REACT_APP_KETH_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/KETH.png',
    },
    {
      name: 'KWBTC',
      symbol: 'KWBTC',
      address: process.env.REACT_APP_KWBTC_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/KWBTC.png',
    },
    {
      name: 'OXRP',
      symbol: 'OXRP',
      address: process.env.REACT_APP_OXRP_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/OXRP.png',
    },
    {
      name: 'KBNB',
      symbol: 'KBNB',
      address: process.env.REACT_APP_KBNB_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/bnb.png',
    },
    {
      name: 'KSP',
      symbol: 'KSP',
      address: process.env.REACT_APP_KSP_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/KSP.png',
    },
    {
      name: 'Favor',
      symbol: 'Favor',
      address: process.env.REACT_APP_FAVOR_ADDRESS_TESTNET,
      chainId: 1001,
      decimals: 18,
      logoURI: '/images/coins/FAVOR.png'
    },
    {
      name: 'FINIX',
      symbol: 'FINIX',
      address: process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 18,
      logoURI: '/images/coins/finix.png',
    },
    {
      name: 'SIX',
      symbol: 'SIX',
      address: process.env.REACT_APP_SIX_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 18,
      logoURI: '/images/coins/six.png',
    },
    {
      name: 'oUSDT',
      symbol: 'oUSDT',
      address: process.env.REACT_APP_OUSDT_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 6,
      logoURI: '/images/coins/OUSDT.png',
    },
    {
      name: 'KDAI',
      symbol: 'KDAI',
      address: process.env.REACT_APP_KDAI_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 18,
      logoURI: '/images/coins/KDAI.png',
    },
    {
      name: 'KETH',
      symbol: 'KETH',
      address: process.env.REACT_APP_KETH_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 18,
      logoURI: '/images/coins/KETH.png',
    },
    {
      name: 'KWBTC',
      symbol: 'KWBTC',
      address: process.env.REACT_APP_KWBTC_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 8,
      logoURI: '/images/coins/KWBTC.png',
    },
    {
      name: 'Orbit Bridge Klaytn Ripple',
      symbol: 'oXRP',
      address: process.env.REACT_APP_OXRP_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 6,
      logoURI: '/images/coins/OXRP.png',
    },
    {
      name: 'KBNB',
      symbol: 'KBNB',
      address: process.env.REACT_APP_KBNB_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 18,
      logoURI: '/images/coins/bnb.png',
    },
    {
      name: 'KSP',
      symbol: 'KSP',
      address: process.env.REACT_APP_KSP_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 18,
      logoURI: '/images/coins/KSP.png',
    },
    {
      name: 'Favor',
      symbol: 'Favor',
      address: process.env.REACT_APP_FAVOR_ADDRESS_MAINNET,
      chainId: 8217,
      decimals: 18,
      logoURI: '/images/coins/FAVOR.png'
    },
  ],
}
