import { SIX, FINIX, WKLAY, OUSDT, KDAI, OETH, OWBTC, OXRP, OBNB, KSP, getLpNetwork, FAVOR } from './tokens'

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
  ousdt: OUSDT,
  kdai: KDAI,
  ksp: KSP,
  oeth: OETH,
  owbtc: OWBTC,
  oxrp: OXRP,
  obnb: OBNB,
  six: SIX,
  finix: FINIX,
  /**
   * @favor
   */
  favor: FAVOR,

  finixSixLP: getLpNetwork(FINIX, SIX),
  finixKusdtLP: getLpNetwork(FINIX, OUSDT),
  finixKlayLP: getLpNetwork(FINIX, WKLAY),
  finixKspLP: getLpNetwork(FINIX, KSP),
  sixKusdtLP: getLpNetwork(SIX, OUSDT),
  sixKlayLP: getLpNetwork(SIX, WKLAY),
  klayKethLP: getLpNetwork(WKLAY, OETH),
  klayKbtcLP: getLpNetwork(WKLAY, OWBTC),
  klayOxrpLP: getLpNetwork(WKLAY, OXRP),
  kethKusdtLP: getLpNetwork(OETH, OUSDT),
  kbtcKusdtLP: getLpNetwork(OWBTC, OUSDT),
  oxrpKusdtLP: getLpNetwork(OXRP, OUSDT),
  klayKusdtLP: getLpNetwork(WKLAY, OUSDT),
  kdaiKusdtLP: getLpNetwork(KDAI, OUSDT),
  obnbKusdtLP: getLpNetwork(OBNB, OUSDT),
  obnbFinixLP: getLpNetwork(OBNB, FINIX),

  definixKlayKusdtLP: getLpNetwork(WKLAY, OUSDT),
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
  myPrivilege: {
    8217: process.env.REACT_APP_MY_PRIVILEGE_ADDRESS_MAINNET,
    1001: process.env.REACT_APP_MY_PRIVILEGE_ADDRESS_TESTNET,
  },
}
