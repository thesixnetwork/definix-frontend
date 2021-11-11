import { RebalanceConfig } from './types'
import { BTCB, ETH } from './tokens'

const rebalances: RebalanceConfig[] = [
  {
    title: 'Bullish Giant',
    description:
      'xxxxxdescriptionxxxxxxxx',
    fullDescription:
      'xxxxxx full descriptionxxxxxxxx',
    icon: ['/images/vaults/satoshi_1.png', '/images/vaults/satoshi_2.png'],
    address: {
      56: '0xF71f0EA92957ef3916E9AE46e8DA295f437eACE9',
      97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
    },
    fee: {
      management: 0.2,
      buyback: 1.5,
      bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'BTCB',
        value: 40,
        color: '#ef9244',
        address: BTCB,
      },
      {
        symbol: 'ETH',
        value: 20,
        color: '#6D6D6D',
        address: ETH,
      },
    ],
    factsheet: {
      name: 'Satoshi and Friends',
      inceptionDate: '',
      manager: '',
      vault: '',
      management: '',
      finixBuyBackFee: '',
      bountyFee: '',
    },
  },
]

export default rebalances
