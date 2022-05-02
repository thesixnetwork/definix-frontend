import { RebalanceConfig } from './types'
import { FINIX, SIX, WKLAY, KWBTC, KETH, OXRP, OUSDT, KBNB } from './tokens'

const rebalances: RebalanceConfig[] = [
  {
    title: 'Bullish Giant',
    description:
      'Withstanding the trend in the market with both giants in the area. The rebalancing will trigger every time the value of the farm is covered with the rebalancing fee.',
    fullDescription:
      'The representation of the giants of the market, consisting of BTC and ETH. The distribution of the assets are 70/30 in ratio for this farm and rebalancing will occur once every time rebalancing fee is covered.',
    icon: [
      '/images/vaults/bullish_giant.png',
      '/images/vaults/bullish_giant@2x.png',
      '/images/vaults/bullish_giant@3x.png',
    ],
    address: {
      1001: '',
      8217: '0x422ECCd512Dc89AD5CBa69097A051Dd85f821fac',
    },
    fee: {
      management: 0.2,
      buyback: 1.5,
      bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'KWBTC',
        value: 70,
        color: '#ef9244',
        address: KWBTC,
      },
      {
        symbol: 'KETH',
        value: 30,
        color: '#6D6D6D',
        address: KETH,
      },
      {
        symbol: 'oUSDT',
        value: 0,
        color: '#2A9D8F',
        address: OUSDT,
      },
    ],
    factsheet: {
      name: 'Bullish Giant',
      inceptionDate: 'Wednesday, September 15, 2021 16:30:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0x422ECCd512Dc89AD5CBa69097A051Dd85f821fac',
      management: '0xBe1babf28dD56D4Fd79d9F290465a849DB68D53F',
      finixBuyBackFee: '0xdEf17b43A4FF27F2F38cCD93093E5F09bf2A0A1c',
      bountyFee: '0x7fF77538930E9E75b3c07ec02077eFeAd27615c2',
    },
    rebalace: 'New',
  },

  {
    title: 'Top Coin Collector',
    description:
      'Famous capital in the farm and highly versatile to the market. The rebalancing will trigger once the value of the farm is covered for the rebalancing fee +1%.',
    fullDescription:
      'Consisting of BTC ETH USDT which is a big capital farm, but with a lower fluctuation exposure to the market as the biggest ratio is in USDT and other assets are distributed equally. The rebalancing occurs every time an extra 1% coverage movement occurs.',
    icon: [
      '/images/vaults/top_coin_collector.png',
      '/images/vaults/top_coin_collector@2x.png',
      '/images/vaults/top_coin_collector@3x.png',
    ],
    address: {
      1001: '',
      8217: '0x98085f75b327CdB0762Bd41dd3B99fa787E2e660',
    },
    fee: {
      management: 0.2,
      buyback: 1.5,
      bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'KWBTC',
        value: 25,
        color: '#ef9244',
        address: KWBTC,
      },
      {
        symbol: 'KETH',
        value: 25,
        color: '#6D6D6D',
        address: KETH,
      },
      {
        symbol: 'oUSDT',
        value: 50,
        color: '#2A9D8F',
        address: OUSDT,
      },
    ],
    factsheet: {
      name: 'Top Coin Collector',
      inceptionDate: 'Wednesday, September 15, 2021 16:30:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0x98085f75b327CdB0762Bd41dd3B99fa787E2e660',
      management: '0xBe1babf28dD56D4Fd79d9F290465a849DB68D53F',
      finixBuyBackFee: '0xdEf17b43A4FF27F2F38cCD93093E5F09bf2A0A1c',
      bountyFee: '0x7fF77538930E9E75b3c07ec02077eFeAd27615c2',
    },
    rebalace: 'New',
  },

  {
    title: 'Three Musketeers',
    description:
      'Inspired by Chain Creators, but with no stable coin in it. The rebalancing will trigger once the value of the farm is covered for the rebalancing fee +1%.',
    fullDescription:
      'The natives of all three chains consist of ETH KLAY BNB which are equally distributed in the farm. An extra 1% rebalance fee is covered and the system will make rebalance for the group.',
    icon: [
      '/images/vaults/three_musketeers.png',
      '/images/vaults/three_musketeers@2x.png',
      '/images/vaults/three_musketeers@3x.png',
    ],
    address: {
      1001: '',
      8217: '0x9e0e235fbd485d43ba44d84684b6bac77033881f',
    },
    fee: {
      management: 0.2,
      buyback: 1.5,
      bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'KETH',
        value: 33,
        color: '#6D6D6D',
        address: KETH,
      },
      {
        symbol: 'WKLAY',
        value: 33,
        color: '#4f463c',
        address: WKLAY,
      },
      {
        symbol: 'KBNB',
        value: 33,
        color: '#eeb80c',
        address: KBNB,
      },
      {
        symbol: 'oUSDT',
        value: 0,
        color: '#2A9D8F',
        address: OUSDT,
      },
    ],
    factsheet: {
      name: 'Three Musketeers',
      inceptionDate: 'Wednesday, September 15, 2021 16:30:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0x9e0e235fbd485d43ba44d84684b6bac77033881f',
      management: '0xBe1babf28dD56D4Fd79d9F290465a849DB68D53F',
      finixBuyBackFee: '0xdEf17b43A4FF27F2F38cCD93093E5F09bf2A0A1c',
      bountyFee: '0x7fF77538930E9E75b3c07ec02077eFeAd27615c2',
    },
    rebalace: 'New',
  },

  {
    title: 'Satoshi and Friends',
    description:
      'Tribute to the founder of BTC. The rebalancing will trigger every 4 hours based on an algorithmic interval based schedule.',
    fullDescription:
      'Consisting of BTC ETH XRP USDT which is a big capital coin with lower rate of fluctuation than the small market cap coins. The highlight which is BTC with the biggest ratio will levitate the performance along with risk allocation in other coins every 4 hours to rebalancing.',
    icon: [
      '/images/vaults/satoshi_and_friends.png',
      '/images/vaults/satoshi_and_friends@2x.png',
      '/images/vaults/satoshi_and_friends@3x.png',
    ],
    address: {
      1001: '0xfaf517E6efB3D799315D5538C34975c51291c2cF',
      8217: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
    },
    fee: {
      management: 0.2,
      buyback: 1.5,
      bounty: 0.3,
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
        color: '#6D6D6D',
        address: KETH,
      },
      {
        symbol: 'oXRP',
        value: 20,
        color: '#23292e',
        address: OXRP,
      },
      {
        symbol: 'oUSDT',
        value: 20,
        color: '#2A9D8F',
        address: OUSDT,
      },
    ],
    factsheet: {
      name: 'Satoshi and Friends',
      inceptionDate: 'Friday, August 13, 2021 13:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
      management: '0xBe1babf28dD56D4Fd79d9F290465a849DB68D53F',
      finixBuyBackFee: '0xdEf17b43A4FF27F2F38cCD93093E5F09bf2A0A1c',
      bountyFee: '0x7fF77538930E9E75b3c07ec02077eFeAd27615c2',
    },
    rebalace: 'Old',
  },

  {
    title: 'Big Cap One Plus',
    description:
      'Leading crypto currencies in the industry. The rebalancing will trigger once the value of the farm is cover the rebalancing fee +1%.',
    fullDescription:
      'Consisting of BTC ETH BNB USDT which is a big capital with lower rate of fluctuation than the smaller market cap coins, responsible for the performance running along with the top market cap cryptocurrency. The ratio is distributed equally for rebalancing every time an extra 1% coverage movement occurs.',
    icon: [
      '/images/vaults/big_cap_one_plus.png',
      '/images/vaults/big_cap_one_plus@2x.png',
      '/images/vaults/big_cap_one_plus@3x.png',
    ],
    address: {
      1001: '0xc292478FaEb31f25744023b03748A4090fcb59dA',
      8217: '0x35F59B33c6510D87eDd1f8F81d9DB9c2763D61C0',
    },
    fee: {
      management: 0.2,
      buyback: 1.5,
      bounty: 0.3,
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
        color: '#6D6D6D',
        address: KETH,
      },
      {
        symbol: 'KBNB',
        value: 20,
        color: '#eeb80c',
        address: KBNB,
      },
      {
        symbol: 'oXRP',
        value: 20,
        color: '#23292e',
        address: OXRP,
      },
      {
        symbol: 'oUSDT',
        value: 20,
        color: '#2A9D8F',
        address: OUSDT,
      },
    ],
    factsheet: {
      name: 'Big Cap One Plus',
      inceptionDate: 'Friday, August 13, 2021 13:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0x35F59B33c6510D87eDd1f8F81d9DB9c2763D61C0',
      management: '0xBe1babf28dD56D4Fd79d9F290465a849DB68D53F',
      finixBuyBackFee: '0xdEf17b43A4FF27F2F38cCD93093E5F09bf2A0A1c',
      bountyFee: '0x7fF77538930E9E75b3c07ec02077eFeAd27615c2',
    },
    rebalace: 'Old',
  },

  {
    title: 'Chain Creators',
    description:
      'Inspired by blockchain creator’s asset. The rebalancing will trigger every time the value of the farm is covered with the rebalancing fee.',
    fullDescription:
      'Consisting of ETH BNB KLAY USDT which is the chain creator for many DeFi. Representing the trend on the DeFi ecosystem and distributing the ratio in the farm equally to make rebalancing trigger once when covering the rebalance fee.',
    icon: [
      '/images/vaults/chain_creators.png',
      '/images/vaults/chain_creators@2x.png',
      '/images/vaults/chain_creators@3x.png',
    ],
    address: {
      1001: '0x47B77DfC1FA6d1D9148558381a13e791ea8a2491',
      8217: '0x7BBc8e4978585D4067b3Cf74e5C48E5778C31c40',
    },
    fee: {
      management: 0.2,
      buyback: 1.5,
      bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'KETH',
        value: 25,
        color: '#6D6D6D',
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
        symbol: 'oUSDT',
        value: 25,
        color: '#2A9D8F',
        address: OUSDT,
      },
    ],
    factsheet: {
      name: 'Chain Creators',
      inceptionDate: 'Friday, August 13, 2021 13:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0x7BBc8e4978585D4067b3Cf74e5C48E5778C31c40',
      management: '0xBe1babf28dD56D4Fd79d9F290465a849DB68D53F',
      finixBuyBackFee: '0xdEf17b43A4FF27F2F38cCD93093E5F09bf2A0A1c',
      bountyFee: '0x7fF77538930E9E75b3c07ec02077eFeAd27615c2',
    },
    rebalace: 'Old',
  },

  {
    title: 'ALT Party',
    description:
      'Designed for Altcoin advocate. The rebalancing will trigger every hour based on an algorithmic interval based schedule.',
    fullDescription:
      'Consisting of ETH XRP BNB USDT with a higher rate of fluctuation in the top market cap coin category. This farm has allocated the risk to the stablecoin and rebalancing strategy is applied every 1 hour.',
    icon: ['/images/vaults/alt_party.png', '/images/vaults/alt_party@2x.png', '/images/vaults/alt_party@3x.png'],
    address: {
      1001: '0x49C493b6B87E90AE06c6f2D9D0c5D88aCE9137A9',
      8217: '0xdc8794615df8CF117B4c856442DbCb7CdF3116ca',
    },
    fee: {
      management: 0.2,
      buyback: 1.5,
      bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'KETH',
        value: 30,
        color: '#6D6D6D',
        address: KETH,
      },
      {
        symbol: 'oXRP',
        value: 30,
        color: '#23292e',
        address: OXRP,
      },
      {
        symbol: 'KBNB',
        value: 30,
        color: '#eeb80c',
        address: KBNB,
      },
      {
        symbol: 'oUSDT',
        value: 10,
        color: '#2A9D8F',
        address: OUSDT,
      },
    ],
    factsheet: {
      name: 'ALT Party',
      inceptionDate: 'Friday, August 13, 2021 13:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0xdc8794615df8CF117B4c856442DbCb7CdF3116ca',
      management: '0xBe1babf28dD56D4Fd79d9F290465a849DB68D53F',
      finixBuyBackFee: '0xdEf17b43A4FF27F2F38cCD93093E5F09bf2A0A1c',
      bountyFee: '0x7fF77538930E9E75b3c07ec02077eFeAd27615c2',
    },
    rebalace: 'Old',
  },

  {
    title: 'FINIX Volatility',
    description:
      'Mixture of different volatility of assets. The rebalancing will trigger every time the value of the farm is cover with the rebalancing fee.',
    fullDescription:
      'Consisting of FINIX BTC ETH SIX KLAY XRP USDT which has the volatility characteristic and high fluctuation. To outperform the top market cap group, the distribution ratio is significant to add up some stablecoin in it. The rebalancing will occur every time it reaches a rebalance fee base.',
    icon: [
      '/images/vaults/finix_volatility.png',
      '/images/vaults/finix_volatility@2x.png',
      '/images/vaults/finix_volatility@3x.png',
    ],
    address: {
      1001: '0x495788Eb76f90F64eaD6297f5b571C4Cdb07EA2e',
      8217: '0xa3A506d486F02bB54E495ed92d89905860803910',
    },
    fee: {
      management: 0.2,
      buyback: 0.75,
      bounty: 0.3,
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
        color: '#6D6D6D',
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
        symbol: 'oXRP',
        value: 16,
        color: '#23292e',
        address: OXRP,
      },
      {
        symbol: 'oUSDT',
        value: 4,
        color: '#2A9D8F',
        address: OUSDT,
      },
    ],
    factsheet: {
      name: 'FINIX Volatility',
      inceptionDate: 'Friday, August 13, 2021 13:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0xa3A506d486F02bB54E495ed92d89905860803910',
      management: '0xBe1babf28dD56D4Fd79d9F290465a849DB68D53F',
      finixBuyBackFee: '0xdEf17b43A4FF27F2F38cCD93093E5F09bf2A0A1c',
      bountyFee: '0x7fF77538930E9E75b3c07ec02077eFeAd27615c2',
    },
    rebalace: 'Old',
  },

  {
    title: 'FINIX Force',
    description:
      'The mixture of ecosystem token the top assets. The rebalancing will trigger every hour based on algorithmic interval based schedule.',
    fullDescription:
      'Consisting of FINIX BTC ETH BNB XRP USDT, the group has a higher fluctuation rate and manages risk by holding stablecoin to increase profitability by rebalancing every hour.',
    icon: ['/images/vaults/finix_force.png', '/images/vaults/finix_force@2x.png', '/images/vaults/finix_force@3x.png'],
    address: {
      1001: '0xE9B499B7639022E7CB68Ce53B9347292d0eA43e9',
      8217: '0x8152c76e4D58A06F660a3736246F7906e849419c',
    },
    fee: {
      management: 0.2,
      buyback: 0.75,
      bounty: 0.3,
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
        color: '#6D6D6D',
        address: KETH,
      },
      {
        symbol: 'KBNB',
        value: 16.6,
        color: '#eeb80c',
        address: KBNB,
      },
      {
        symbol: 'oXRP',
        value: 16.6,
        color: '#23292e',
        address: OXRP,
      },
      {
        symbol: 'oUSDT',
        value: 16.6,
        color: '#2A9D8F',
        address: OUSDT,
      },
    ],
    factsheet: {
      name: 'FINIX Force',
      inceptionDate: 'Friday, August 13, 2021 13:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0x8152c76e4D58A06F660a3736246F7906e849419c',
      management: '0xBe1babf28dD56D4Fd79d9F290465a849DB68D53F',
      finixBuyBackFee: '0xdEf17b43A4FF27F2F38cCD93093E5F09bf2A0A1c',
      bountyFee: '0x7fF77538930E9E75b3c07ec02077eFeAd27615c2',
    },
    rebalace: 'Old',
  },
]

export default rebalances
