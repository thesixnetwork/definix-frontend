import { RebalanceConfig } from './types'
import { FINIX, SIX, WKLAY, KWBTC, KETH, KXRP, KUSDT, KBNB } from './tokens'

const rebalances: RebalanceConfig[] = [
  {
    title: 'Satoshi and Friends',
    description: 'REBALANCING FARM',
    fullDescription:
      'Consisting of BTC ETH XRP USDT which is a big capital coin with lower rate of fluctuation than the small market cap coins. The highlight which is BTC with the biggest ratio will levitate the performance along with risk allocation in other coins every 4 hours to rebalancing.',
    icon: ['/images/vaults/satoshi_1.png', '/images/vaults/satoshi_2.png'],
    address: {
      1001: '0xfaf517E6efB3D799315D5538C34975c51291c2cF',
      8217: '0xfaf517E6efB3D799315D5538C34975c51291c2cF',
    },
    ratio: [
      {
        symbol: 'KWBTC',
        value: 40,
        color: '#ef9244',
        address: KWBTC,
      },
      {
        symbol: 'KETH',
        value: 20,
        color: '#393939',
        address: KETH,
      },
      {
        symbol: 'KXRP',
        value: 20,
        color: '#23292e',
        address: KXRP,
      },
      {
        symbol: 'KUSDT',
        value: 20,
        color: '#2A9D8F',
        address: KUSDT,
      },
    ],
    factsheet: {
      name: 'Satoshi and Friends',
      inceptionDate: 'Sun, 16 May 2021 22:48:20 GMT',
      manager: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      vault: '0xA41dAFFd73A21E4B9bB4AeACdEDD9b5baba62773',
      comptroller: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
      management: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      finixBuyBackFee: '0x86fb84e92c1eedc245987d28a42e123202bd6701',
      bountyFee: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
    },
  },

  {
    title: 'Big Cap One Plus',
    description: 'REBALANCING FARM',
    fullDescription:
      'Consisting of BTC ETH BNB USDT which is a big capital with lower rate of fluctuation than the smaller market cap coins, responsible for the performance running along with the top market cap cryptocurrency. The ratio is distributed equally for rebalancing every time an extra 1% coverage movement occurs.',
    icon: ['/images/vaults/bigcap_1.png', '/images/vaults/bigcap_2.png'],
    address: {
      1001: '0xc292478FaEb31f25744023b03748A4090fcb59dA',
      8217: '0xc292478FaEb31f25744023b03748A4090fcb59dA',
    },
    ratio: [
      {
        symbol: 'KWBTC',
        value: 20,
        color: '#ef9244',
        address: KWBTC,
      },
      {
        symbol: 'KETH',
        value: 20,
        color: '#393939',
        address: KETH,
      },
      {
        symbol: 'KBNB',
        value: 20,
        color: '#eeb80c',
        address: KBNB,
      },
      {
        symbol: 'KXRP',
        value: 20,
        color: '#23292e',
        address: KXRP,
      },
      {
        symbol: 'KUSDT',
        value: 20,
        color: '#2A9D8F',
        address: KUSDT,
      },
    ],
    factsheet: {
      name: 'Big Cap One Plus',
      inceptionDate: 'Sun, 16 May 2021 22:48:20 GMT',
      manager: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      vault: '0xA41dAFFd73A21E4B9bB4AeACdEDD9b5baba62773',
      comptroller: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
      management: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      finixBuyBackFee: '0x86fb84e92c1eedc245987d28a42e123202bd6701',
      bountyFee: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
    },
  },

  {
    title: 'Chain Creators',
    description: 'REBALANCING FARM',
    fullDescription:
      'Consisting of ETH BNB KLAY USDT which is the chain creator for many DeFi. Representing the trend on the DeFi ecosystem and distributing the ratio in the farm equally to make rebalancing trigger once when covering the rebalance fee.',
    icon: ['/images/vaults/chaincreator_1.png', '/images/vaults/chaincreator_2.png'],
    address: {
      1001: '0x47B77DfC1FA6d1D9148558381a13e791ea8a2491',
      8217: '0x47B77DfC1FA6d1D9148558381a13e791ea8a2491',
    },
    ratio: [
      {
        symbol: 'KETH',
        value: 25,
        color: '#393939',
        address: KETH,
      },
      {
        symbol: 'KBNB',
        value: 25,
        color: '#eeb80c',
        address: KBNB,
      },
      {
        symbol: 'WKLAY',
        value: 25,
        color: '#4f463c',
        address: WKLAY,
      },
      {
        symbol: 'KUSDT',
        value: 25,
        color: '#2A9D8F',
        address: KUSDT,
      },
    ],
    factsheet: {
      name: 'Chain Creators',
      inceptionDate: 'Sun, 16 May 2021 22:48:20 GMT',
      manager: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      vault: '0xA41dAFFd73A21E4B9bB4AeACdEDD9b5baba62773',
      comptroller: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
      management: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      finixBuyBackFee: '0x86fb84e92c1eedc245987d28a42e123202bd6701',
      bountyFee: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
    },
  },

  {
    title: 'ALT Party',
    description: 'REBALANCING FARM',
    fullDescription:
      'Consisting of ETH XRP BNB USDT with a higher rate of fluctuation in the top market cap coin category. This farm has allocated the risk to the stablecoin and rebalancing strategy is applied every 1 hour.',
    icon: ['/images/vaults/altparty_1.png', '/images/vaults/altparty_2.png'],
    address: {
      1001: '0x49C493b6B87E90AE06c6f2D9D0c5D88aCE9137A9',
      8217: '0x49C493b6B87E90AE06c6f2D9D0c5D88aCE9137A9',
    },
    ratio: [
      {
        symbol: 'KETH',
        value: 30,
        color: '#393939',
        address: KETH,
      },
      {
        symbol: 'KXRP',
        value: 30,
        color: '#23292e',
        address: KXRP,
      },
      {
        symbol: 'KBNB',
        value: 30,
        color: '#eeb80c',
        address: KBNB,
      },
      {
        symbol: 'KUSDT',
        value: 10,
        color: '#2A9D8F',
        address: KUSDT,
      },
    ],
    factsheet: {
      name: 'ALT Party',
      inceptionDate: 'Sun, 16 May 2021 22:48:20 GMT',
      manager: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      vault: '0xA41dAFFd73A21E4B9bB4AeACdEDD9b5baba62773',
      comptroller: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
      management: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      finixBuyBackFee: '0x86fb84e92c1eedc245987d28a42e123202bd6701',
      bountyFee: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
    },
  },

  {
    title: 'FINIX Volatility',
    description: 'REBALANCING FARM',
    fullDescription:
      'Consisting of FINIX BTC ETH SIX KLAY XRP USDT which has the volatility characteristic and high fluctuation. To outperform the top market cap group, the distribution ratio is significant to add up some stablecoin in it. The rebalancing will occur every time it reaches a rebalance fee base.',
    icon: ['/images/vaults/volatility_1.png', '/images/vaults/volatility_2.png'],
    address: {
      1001: '0x495788Eb76f90F64eaD6297f5b571C4Cdb07EA2e',
      8217: '0x495788Eb76f90F64eaD6297f5b571C4Cdb07EA2e',
    },
    ratio: [
      {
        symbol: 'FINIX',
        value: 16,
        color: '#FFFFFF',
        address: FINIX,
      },
      {
        symbol: 'KWBTC',
        value: 16,
        color: '#ef9244',
        address: KWBTC,
      },
      {
        symbol: 'KETH',
        value: 16,
        color: '#393939',
        address: KETH,
      },
      {
        symbol: 'SIX',
        value: 16,
        color: '#647BD4',
        address: SIX,
      },
      {
        symbol: 'WKLAY',
        value: 16,
        color: '#4f463c',
        address: WKLAY,
      },
      {
        symbol: 'KXRP',
        value: 16,
        color: '#23292e',
        address: KXRP,
      },
      {
        symbol: 'KUSDT',
        value: 4,
        color: '#2A9D8F',
        address: KUSDT,
      },
    ],
    factsheet: {
      name: 'FINIX Volatility',
      inceptionDate: 'Sun, 16 May 2021 22:48:20 GMT',
      manager: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      vault: '0xA41dAFFd73A21E4B9bB4AeACdEDD9b5baba62773',
      comptroller: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
      management: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      finixBuyBackFee: '0x86fb84e92c1eedc245987d28a42e123202bd6701',
      bountyFee: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
    },
  },

  {
    title: 'FINIX Force',
    description: 'REBALANCING FARM',
    fullDescription:
      'Consisting of FINIX BTC ETH BNB XRP USDT, the group has a higher fluctuation rate and manages risk by holding stablecoin to increase profitability by rebalancing every hour.',
    icon: ['/images/vaults/finixforce_1.png', '/images/vaults/finixforce_2.png'],
    address: {
      1001: '0xE9B499B7639022E7CB68Ce53B9347292d0eA43e9',
      8217: '0xE9B499B7639022E7CB68Ce53B9347292d0eA43e9',
    },
    ratio: [
      {
        symbol: 'FINIX',
        value: 16.6,
        color: '#FFFFFF',
        address: FINIX,
      },
      {
        symbol: 'KWBTC',
        value: 16.6,
        color: '#ef9244',
        address: KWBTC,
      },
      {
        symbol: 'KETH',
        value: 16.6,
        color: '#393939',
        address: KETH,
      },
      {
        symbol: 'KBNB',
        value: 16.6,
        color: '#eeb80c',
        address: KBNB,
      },
      {
        symbol: 'KXRP',
        value: 16.6,
        color: '#23292e',
        address: KXRP,
      },
      {
        symbol: 'KUSDT',
        value: 16.6,
        color: '#2A9D8F',
        address: KUSDT,
      },
    ],
    factsheet: {
      name: 'FINIX Force',
      inceptionDate: 'Sun, 16 May 2021 22:48:20 GMT',
      manager: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      vault: '0xA41dAFFd73A21E4B9bB4AeACdEDD9b5baba62773',
      comptroller: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
      management: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      finixBuyBackFee: '0x86fb84e92c1eedc245987d28a42e123202bd6701',
      bountyFee: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d',
    },
  },
]

export default rebalances
