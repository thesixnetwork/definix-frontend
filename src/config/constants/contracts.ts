import { VELO2, VELO, SIX, FINIX, WBNB, USDT, BUSD, BTCB, ETH, XRP, ADA, getLpNetwork } from './tokens'

export default {
  definixHerodotus: {
    97: process.env.REACT_APP_PANCAKE_MASTER_CHEF_TESTNET,
    56: process.env.REACT_APP_PANCAKE_MASTER_CHEF_MAINNET,
  },
  herodotus: {
    97: process.env.REACT_APP_HERODOTUS_TESTNET,
    56: process.env.REACT_APP_HERODOTUS_MAINNET,
  },
  pancakeBnbBusdLP: {
    97: process.env.REACT_APP_PANCAKE_BNB_BUSD_LP_TESTNET,
    56: process.env.REACT_APP_PANCAKE_BNB_BUSD_LP_MAINNET,
  },
  wbnb: WBNB,
  usdt: USDT,
  busd: BUSD,
  eth: ETH,
  btcb: BTCB,
  xrp: XRP,
  ada: ADA,
  six: SIX,
  finix: FINIX,
  velo: VELO,
  velo2: VELO2,
  finixSixLP: getLpNetwork(FINIX, SIX),
  finixBusdLP: getLpNetwork(FINIX, BUSD),
  finixBnbLP: getLpNetwork(FINIX, WBNB),
  sixBusdLP: getLpNetwork(SIX, BUSD),
  sixBnbLP: getLpNetwork(SIX, WBNB),
  usdtBusdLP: getLpNetwork(USDT, BUSD),
  bnbBusdLP: getLpNetwork(WBNB, BUSD),
  bnbBtcbLP: getLpNetwork(WBNB, BTCB),
  ethBnbLP: getLpNetwork(ETH, WBNB),
  xrpBnbLP: getLpNetwork(XRP, WBNB),
  adaBnbLP: getLpNetwork(ADA, WBNB),
  ethBtcbtLP: getLpNetwork(ETH, BTCB),
  tradingCompetRegis: {
    97: process.env.REACT_APP_TRADING_COMPET_REGIS_TESTNET,
    56: process.env.REACT_APP_TRADING_COMPET_REGIS_MAINNET,
  },
  airdropKlay: {
    97: process.env.REACT_APP_ARIDROP_KLAY_TESTNET,
    56: process.env.REACT_APP_ARIDROP_KLAY_MAINNET,
  },
  veloFinixLP: {
    97: process.env.REACT_APP_LP_VELO_FINIX_TESTNET,
    56: process.env.REACT_APP_LP_VELO_FINIX_MAINNET,
  },
  veloApolloNew: {
    97: '0x9b8bA786d9BBE6f8F81DD099F618FE69ca08D2B5',
    56: process.env.REACT_APP_LP_VELO_FINIX_MAINNET,
  },
  // configured =====================================================
  syrup: {
    97: '0x36101b46fD2C799420f32B2fE267736e72362778',
    56: '0x009cF7bC57584b7998236eff51b98A168DceA9B0',
  },
  sousChef: {
    97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
    56: '0x6ab8463a4185b80905e05a9ff80a2d6b714b9e95',
  },
  lottery: {
    97: '0x99c2EcD51d52c036B00130d882Bc65f20Fdecf9f',
    56: '0x3C3f2049cc17C136a604bE23cF7E42745edf3b91',
  },
  lotteryNFT: {
    97: '0x8175c10383511b3a1C68f9dB222dc14A19CC950e',
    56: '0x5e74094Cd416f55179DBd0E45b1a8ED030e396A1',
  },
  mulltiCall: {
    56: '0x1ee38d535d541c55c9dae27b12edf090c608e6fb',
    97: '0x67ADCB4dF3931b0C5Da724058ADC2174a9844412',
  },
  deParam: {
    56: process.env.REACT_APP_DEPARAM_ADDRESS_TESTNET,
    97: process.env.REACT_APP_DEPARAM_ADDRESS_MAINNET,
  },
  ust: {
    56: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
    97: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
  },
  definixProfile: {
    56: '0xDf4dBf6536201370F95e06A0F8a7a70fE40E388a',
    97: '0x4B683C7E13B6d5D7fd1FeA9530F451954c1A7c8A',
  },
  definixRabbits: {
    56: '0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07',
    97: '0x60935F36e4631F73f0f407e68642144e07aC7f5E',
  },
  bunnyFactory: {
    56: '0xfa249Caa1D16f75fa159F7DFBAc0cC5EaB48CeFf',
    97: '0x707CBF373175fdB601D34eeBF2Cf665d08f01148',
  },
  claimRefund: {
    56: '0xE7e53A7e9E3Cf6b840f167eF69519175c497e149',
    97: '',
  },
  pointCenterIfo: {
    56: '0x3C6919b132462C1FEc572c6300E83191f4F0012a',
    97: '0xd2Ac1B1728Bb1C11ae02AB6e75B76Ae41A2997e3',
  },
  bunnySpecial: {
    56: '0xFee8A195570a18461146F401d6033f5ab3380849',
    97: '0x7b7b1583De1DeB32Ce6605F6deEbF24A0671c17C',
  },
}
