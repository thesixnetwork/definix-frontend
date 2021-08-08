import { RebalanceConfig } from './types'
import { SIX, FINIX, KUSDT } from './tokens'

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
        symbol: 'FINIX',
        value: 33.3,
        color: '#FFFFFF',
        address: FINIX,
      },
      {
        symbol: 'KUSDT',
        value: 33.3,
        color: '#2A9D8F',
        address: KUSDT,
      },
    ],
  },
  {
    title: 'Title1',
    description: 'Description',
    icon: '/images/cash_fund.png',
    address: {
      1001: '0x576088f7923a333b9125cb608b6E50C30c75Bd79',
      8217: '0x576088f7923a333b9125cb608b6E50C30c75Bd79',
    },
    ratio: [
      {
        symbol: 'SIX',
        value: 33.3,
        color: '#647BD4',
        address: SIX,
      },
      {
        symbol: 'FINIX',
        value: 33.3,
        color: '#FFFFFF',
        address: FINIX,
      },
      {
        symbol: 'KUSDT',
        value: 33.3,
        color: '#2A9D8F',
        address: KUSDT,
      },
    ],
  },
  {
    title: 'Title',
    description: 'Description',
    icon: '/images/cash_fund.png',
    address: {
      1001: '0x7432B6d9fc73Db6Ffd60Fb84C75e9335C1330477',
      8217: '0x7432B6d9fc73Db6Ffd60Fb84C75e9335C1330477',
    },
    ratio: [
      {
        symbol: 'SIX',
        value: 33.3,
        color: '#647BD4',
        address: SIX,
      },
      {
        symbol: 'FINIX',
        value: 33.3,
        color: '#FFFFFF',
        address: FINIX,
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
