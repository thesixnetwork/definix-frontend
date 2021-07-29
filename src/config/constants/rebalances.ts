import { RebalanceConfig } from './types'

const rebalances: RebalanceConfig[] = [
  {
    title: 'Title1',
    description: 'Description',
    icon: '/images/cash_fund.png',
    address: {
      1001: '0x576088f7923a333b9125cb608b6E50C30c75Bd79',
      8217: '0x576088f7923a333b9125cb608b6E50C30c75Bd79',
      // 1001: '0x68E02B072aA52CBD3dCbE6972Af4EF30bE8da429',
      // 8217: '0x68E02B072aA52CBD3dCbE6972Af4EF30bE8da429',
      // 1001: '0x680aa241e4f1949bEdE521EC1607Ce1c5060CEeb',
      // 8217: '0x680aa241e4f1949bEdE521EC1607Ce1c5060CEeb',
      // 1001: '0x9ea23383D679e1dD61E2F5488531893f084c588e',
      // 8217: '0x9ea23383D679e1dD61E2F5488531893f084c588e',
    },
    ratio: [
      {
        symbol: 'SIX',
        value: 33.3,
        color: '#647BD4',
      },
      {
        symbol: 'FINIX',
        value: 33.3,
        color: '#FFFFFF',
      },
      {
        symbol: 'KUSDT',
        value: 33.3,
        color: '#2A9D8F',
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
      // 1001: '0x68E02B072aA52CBD3dCbE6972Af4EF30bE8da429',
      // 8217: '0x68E02B072aA52CBD3dCbE6972Af4EF30bE8da429',
      // 1001: '0x680aa241e4f1949bEdE521EC1607Ce1c5060CEeb',
      // 8217: '0x680aa241e4f1949bEdE521EC1607Ce1c5060CEeb',
      // 1001: '0x9ea23383D679e1dD61E2F5488531893f084c588e',
      // 8217: '0x9ea23383D679e1dD61E2F5488531893f084c588e',
    },
    ratio: [
      {
        symbol: 'SIX',
        value: 33.3,
        color: '#647BD4',
      },
      {
        symbol: 'FINIX',
        value: 33.3,
        color: '#FFFFFF',
      },
      {
        symbol: 'KUSDT',
        value: 33.3,
        color: '#2A9D8F',
      },
    ],
  },
]

export default rebalances
