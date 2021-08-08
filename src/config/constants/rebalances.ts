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
        color: '#FFFFFF',
        address: WKLAY,
      },
      {
        symbol: 'KUSDT',
        value: 33.3,
        color: '#2A9D8F',
        address: KUSDT,
      },
    ],
  },
]

export default rebalances
