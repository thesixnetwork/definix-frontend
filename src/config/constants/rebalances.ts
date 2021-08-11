import { RebalanceConfig } from './types'
import { SIX, WKLAY, KUSDT } from './tokens'

const rebalances: RebalanceConfig[] = [
  {
    title: 'Title txs',
    description: 'Have txs',
    icon: '/images/cash_fund.png',
    address: {
      1001: '0x5E840B91cF0675Ada96FBA09028a371b6CFbD551',
      8217: '0x5E840B91cF0675Ada96FBA09028a371b6CFbD551',
    },
    ratio: [
      {
        symbol: 'SIX',
        value: 33.3,
        color: '#647BD4',
        address: SIX,
      },
      {
        symbol: 'WKLAY',
        value: 33.3,
        color: '#4f463c',
        address: WKLAY,
      },
      {
        symbol: 'KUSDT',
        value: 33.3,
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
