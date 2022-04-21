import { SIX, FINIX, WKLAY, KUSDT, KDAI, KETH, KWBTC, KXRP, KBNB, KSP, getLpNetwork, FAVOR } from './tokens'

export default {
  bscFinix: {
    1001: process.env.REACT_APP_BSC_FINIX_ADDRESS_TESTNET,
    8217: process.env.REACT_APP_BSC_FINIX_ADDRESS_MAINNET,
  },
  bscCollecteral: {
    1001: process.env.REACT_APP_BSC_COLLECTERAL_ADDRESS_TESTNET,
    8217: process.env.REACT_APP_BSC_COLLECTERAL_ADDRESS_MAINNET,
  },
  definixHerodotus: {
    1001: process.env.REACT_APP_HERODOTUS_TESTNET,
    8217: process.env.REACT_APP_HERODOTUS_MAINNET,
  },
  herodotus: {
    1001: process.env.REACT_APP_HERODOTUS_TESTNET,
    8217: process.env.REACT_APP_HERODOTUS_MAINNET,
  },
  wklay: WKLAY,
  kusdt: KUSDT,
  kdai: KDAI,
  ksp: KSP,
  keth: KETH,
  kwbtc: KWBTC,
  kxrp: KXRP,
  kbnb: KBNB,
  six: SIX,
  finix: FINIX,
  favor: FAVOR,
  finixSixLP: getLpNetwork(FINIX, SIX),
  finixKusdtLP: getLpNetwork(FINIX, KUSDT),
  finixKlayLP: getLpNetwork(FINIX, WKLAY),
  finixKspLP: getLpNetwork(FINIX, KSP),
  sixKusdtLP: getLpNetwork(SIX, KUSDT),
  sixKlayLP: getLpNetwork(SIX, WKLAY),
  klayKethLP: getLpNetwork(WKLAY, KETH),
  klayKbtcLP: getLpNetwork(WKLAY, KWBTC),
  klayKxrpLP: getLpNetwork(WKLAY, KXRP),
  kethKusdtLP: getLpNetwork(KETH, KUSDT),
  kbtcKusdtLP: getLpNetwork(KWBTC, KUSDT),
  kxrpKusdtLP: getLpNetwork(KXRP, KUSDT),
  klayKusdtLP: getLpNetwork(WKLAY, KUSDT),
  kdaiKusdtLP: getLpNetwork(KDAI, KUSDT),
  kbnbKusdtLP: getLpNetwork(KBNB, KUSDT),
  kbnbFinixLP: getLpNetwork(KBNB, FINIX),
  definixKlayKusdtLP: getLpNetwork(WKLAY, KUSDT),
  tradingCompetRegis: {
    1001: process.env.REACT_APP_TRADING_COMPET_REGIS_TESTNET,
    8217: process.env.REACT_APP_TRADING_COMPET_REGIS_MAINNET,
  },
  // configured =====================================================
  syrup: {
    1001: '0xBB8CD7F5397118Ab4573418fd89359a3A06bCb43',
    8217: '0xBB8CD7F5397118Ab4573418fd89359a3A06bCb43',
  },
  sousChef: {
    1001: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
    8217: '0x6ab8463a4185b80905e05a9ff80a2d6b714b9e95',
  },
  lottery: {
    1001: '0x99c2EcD51d52c036B00130d882Bc65f20Fdecf9f',
    8217: '0x3C3f2049cc17C136a604bE23cF7E42745edf3b91',
  },
  lotteryNFT: {
    1001: '0x8175c10383511b3a1C68f9dB222dc14A19CC950e',
    8217: '0x5e74094Cd416f55179DBd0E45b1a8ED030e396A1',
  },
  mulltiCall: {
    1001: process.env.REACT_APP_MULTICALL_ADDRESS_TESTNET,
    8217: process.env.REACT_APP_MULTICALL_ADDRESS_MAINNET,
  },
  deParam: {
    1001: process.env.REACT_APP_DEPARAM_ADDRESS_TESTNET,
    8217: process.env.REACT_APP_DEPARAM_ADDRESS_MAINNET,
  },
  ust: {
    8217: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
    1001: '',
  },
  definixProfile: {
    8217: '0xDf4dBf6536201370F95e06A0F8a7a70fE40E388a',
    1001: '0x4B683C7E13B6d5D7fd1FeA9530F451954c1A7c8A',
  },
  definixRabbits: {
    8217: '0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07',
    1001: '0x60935F36e4631F73f0f407e68642144e07aC7f5E',
  },
  bunnyFactory: {
    8217: '0xfa249Caa1D16f75fa159F7DFBAc0cC5EaB48CeFf',
    1001: '0x707CBF373175fdB601D34eeBF2Cf665d08f01148',
  },
  eth: {
    8217: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    1001: '',
  },
  claimRefund: {
    8217: '0xE7e53A7e9E3Cf6b840f167eF69519175c497e149',
    1001: '',
  },
  pointCenterIfo: {
    8217: '0x3C6919b132462C1FEc572c6300E83191f4F0012a',
    1001: '0xd2Ac1B1728Bb1C11ae02AB6e75B76Ae41A2997e3',
  },
  bunnySpecial: {
    8217: '0xFee8A195570a18461146F401d6033f5ab3380849',
    1001: '0x7b7b1583De1DeB32Ce6605F6deEbF24A0671c17C',
  },
  vFinix: {
    8217: process.env.REACT_APP_VFINIX_ADDRESS_MAINNET,
    1001: process.env.REACT_APP_VFINIX_ADDRESS_TESTNET,
  },
  vFinixVoting: {
    8217: process.env.REACT_APP_VFINIX_VOTING_ADDRESS_MAINNET,
    1001: process.env.REACT_APP_VFINIX_VOTING_ADDRESS_TESTNET,
  },
}
