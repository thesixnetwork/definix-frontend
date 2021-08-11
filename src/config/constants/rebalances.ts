import { RebalanceConfig } from './types'
import { FINIX, SIX, WKLAY, KWBTC, KETH, KXRP, KUSDT, KBNB } from './tokens'

const rebalances: RebalanceConfig[] = [
  {
    title: 'Satoshi and Friends',
    description: 'This is description',
    icon: '/images/coins/satoshi.png',
    address: {
      1001: '0x8354aa7342d32ebCa12f1613A4b832c9aB15c74C',
      8217: '0x8354aa7342d32ebCa12f1613A4b832c9aB15c74C',
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
  },

  {
    title: 'Big Cap One Plus',
    description: 'This is description',
    icon: '/images/coins/bigcap.png',
    address: {
      1001: '0x82a17B0f7E9b5719f94013B1240505a2Ba3e7840',
      8217: '0x82a17B0f7E9b5719f94013B1240505a2Ba3e7840',
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
  },

  {
    title: 'Chain Creators',
    description: 'This is description',
    icon: '/images/coins/chaincreator.png',
    address: {
      1001: '0xE967080620699AeC88E01F1e9c9C1d77652522E2',
      8217: '0xE967080620699AeC88E01F1e9c9C1d77652522E2',
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
  },

  {
    title: 'ALT Party',
    description: 'This is description',
    icon: '/images/coins/altparty.png',
    address: {
      1001: '0x40525428616498F077cf801E9aA38A7464EA4256',
      8217: '0x40525428616498F077cf801E9aA38A7464EA4256',
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
  },

  {
    title: 'FINIX Volatility',
    description: 'This is description',
    icon: '/images/coins/volatility.png',
    address: {
      1001: '0xA41dAFFd73A21E4B9bB4AeACdEDD9b5baba62773',
      8217: '0xA41dAFFd73A21E4B9bB4AeACdEDD9b5baba62773',
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
  },

  {
    title: 'FINIX Force',
    description: 'This is description',
    icon: '/images/coins/finixforce.png',
    address: {
      1001: '0x41844a6Db9144eBEfBa470E6F994341FbC095810',
      8217: '0x41844a6Db9144eBEfBa470E6F994341FbC095810',
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
    factsheet: [
      { title: 'Name', value: 'Re-balancing BTC focus', copy: false },
      { title: 'Inception date', value: 'Wed, 11 Aug 2021 03:12:20 GMT', copy: false },
      { title: 'Manager', value: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2', copy: true },
      { title: 'Vault', value: '0x86fb84e92c1eedc245987d28a42e123202bd6701', copy: true },
      { title: 'Comptroller', value: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d', copy: true },
      { title: 'Management fee', value: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2', copy: true },
      { title: 'FINIX buy back fee', value: '0x86fb84e92c1eedc245987d28a42e123202bd6701', copy: true },
      { title: 'Bounty fee', value: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d', copy: true },
    ],
  },
]

export default rebalances
