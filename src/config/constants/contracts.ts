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
  /**
   * @favor
   */
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
  /**
   * @favor
   */
  favorKusdtLP: getLpNetwork(FAVOR, KUSDT),

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
  eth: {
    8217: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    1001: '',
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
