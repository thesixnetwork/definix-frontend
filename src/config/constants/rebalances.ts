import { RebalanceConfig } from './types'
import {
  BTCB,
  ADA,
  ETH,
  AVAX,
  WBNB,
  DOT,
  THG,
  AXS,
  MBOX,
  TLM,
  ALICE,
  BUSD,
  CAKE,
  SUSHI,
  UNI,
  ALPHA,
  DODO,
  USDT,
  XRP,
  DOGE,
  LTC,
} from './tokens'

export const customRouter = {
  definix: {
    56: process.env.REACT_APP_ROUTER_ADDRESS_MAINNET,
    97: process.env.REACT_APP_ROUTER_ADDRESS_TESTNET,
  },
  pancake: {
    56: process.env.REACT_APP_PANCAKEV2_ROUTER_ADDRESS_MAINNET,
    97: process.env.REACT_APP_PANCAKEV2_ROUTER_ADDRESS_TESTNET,
  },
  apeswap: {
    56: process.env.REACT_APP_APESWAP_ROUTER_ADDRESS_MAINNET,
    97: process.env.REACT_APP_APESWAP_ROUTER_ADDRESS_TESTNET,
  },
}

export const customFactory = {
  definix: {
    56: process.env.REACT_APP_MAINNET_FACTORY_ADDRESS,
    97: process.env.REACT_APP_TESTNET_FACTORY_ADDRESS,
  },
  pancake: {
    56: process.env.REACT_APP_MAINNET_PANCAKEV2_FACTORY_ADDRESS,
    97: process.env.REACT_APP_TESTNET_PANCAKEV2_FACTORY_ADDRESS,
  },
  apeswap: {
    56: process.env.REACT_APP_MAINNET_APESWAP_FACTORY_ADDRESS,
    97: process.env.REACT_APP_TESTNET_APESWAP_FACTORY_ADDRESS,
  },
}

export const customInitCodeHash = {
  definix: {
    56: process.env.REACT_APP_MAINNET_INIT_CODE_HASH,
    97: process.env.REACT_APP_TESTNET_INIT_CODE_HASH,
  },
  pancake: {
    56: process.env.REACT_APP_MAINNET_PANCAKEV2_INIT_CODE_HASH,
    97: process.env.REACT_APP_TESTNET_PANCAKEV2_INIT_CODE_HASH,
  },
  apeswap: {
    56: process.env.REACT_APP_MAINNET_APESWAP_INIT_CODE_HASH,
    97: process.env.REACT_APP_TESTNET_APESWAP_INIT_CODE_HASH,
  },
}

const rebalances: RebalanceConfig[] = [
  {
    title: 'Bullish Giant',
    description:
      'Withstanding the trend in the market with both giants in the area. The rebalancing will trigger every time the value of the farm is covered with the rebalancing fee.',
    fullDescription:
      'The representation of the giants of the markert, consisting of BTC and ETH. The distribution of the assets are 70/30 in ratio for this farm and rebalancing will occur once every time rebalancing fee is covered.',
    icon: ['/images/vaults/bull1.png', '/images/vaults/bull2.png'],
    address: {
      56: '0xF71f0EA92957ef3916E9AE46e8DA295f437eACE9',
      97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
    },
    router: [customRouter.definix, customRouter.definix],
    factory: [customFactory.definix, customFactory.definix],
    initCodeHash: [customInitCodeHash.definix, customInitCodeHash.definix],
    fee: {
      management: 0.5,
      buyback: 1.0,
      // bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'BTCB',
        value: 70,
        color: '#ef9244',
        address: BTCB,
      },
      {
        symbol: 'ETH',
        value: 30,
        color: '#6D6D6D',
        address: ETH,
      },
    ],
    factsheet: {
      name: 'Bullish Giant',
      inceptionDate: 'Wednesday, November 1, 2021 15:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0xF71f0EA92957ef3916E9AE46e8DA295f437eACE9',
      management: '',
      finixBuyBackFee: '',
      bountyFee: '',
    },
  },

  {
    title: 'PoS Top Pick',
    description:
      'Proof of Stake leader. The rebalancing will trigger hourly once the price of rebalancing is covered by 2% of fee.',
    fullDescription:
      'Proof of Stake (POS) is one of the most popular consensus algorithms in the cryptocurrency industry. Even Etheruem is trying to adapt this consensus algorithm. The strength of the PoS is faster and cheaper compared to Proof of Work (PoW). With the mentioned advantages, it can provide the maximum benefits for its holders, especially the Altcoin holders. Rebalancing will occur every hour if the rebalancing fee is 2% covered.',
    icon: ['/images/vaults/pos1.png', '/images/vaults/pos2.png'],
    address: {
      56: '0xff41060E2da907aEe94A9E6349Ef23F2A6f12C79',
      97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
    },
    router: [
      customRouter.definix,
      customRouter.definix,
      customRouter.apeswap,
      customRouter.pancake,
      customRouter.pancake,
    ],
    factory: [
      customFactory.definix,
      customFactory.definix,
      customFactory.apeswap,
      customFactory.pancake,
      customFactory.pancake,
    ],
    initCodeHash: [
      customInitCodeHash.definix,
      customInitCodeHash.definix,
      customInitCodeHash.apeswap,
      customInitCodeHash.pancake,
      customInitCodeHash.pancake,
    ],
    fee: {
      management: 0.2,
      buyback: 1.5,
      // bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'ADA',
        value: 20,
        color: '#0031af',
        address: ADA,
      },
      {
        symbol: 'ETH',
        value: 20,
        color: '#6D6D6D',
        address: ETH,
      },
      {
        symbol: 'AVAX',
        value: 20,
        color: '#e84141',
        address: AVAX,
      },
      {
        symbol: 'WBNB',
        value: 20,
        color: '#eeb80c',
        address: WBNB,
      },
      {
        symbol: 'DOT',
        value: 20,
        color: '#e7027b',
        address: DOT,
      },
    ],
    factsheet: {
      name: 'PoS Top Pick',
      inceptionDate: 'Wednesday, November 1, 2021 15:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0xff41060E2da907aEe94A9E6349Ef23F2A6f12C79',
      management: '',
      finixBuyBackFee: '',
      bountyFee: '',
    },
  },
  {
    title: 'Game Index',
    description:
      'Major game fi currencies. The rebalancing will trigger hourly once the price of rebalancing is covered by 2% of fee.',
    fullDescription:
      'Game-Fi has been a recent hype in the DeFi world especially Game NFT, and the rebranding announcement of Facebook to Meta. It drives the internet world crazy. Game-Fi can be super volatile and give a super high profit. We also added the BUSD to this farm to help mitigate the loss that might occur from the negative price fluctuations. Rebalancing will occur every hour if the rebalancing fee is 2% covered.',
    icon: ['/images/vaults/game1.png', '/images/vaults/game2.png'],
    address: {
      56: '0xB7d9f0aEdFd9270f3BD676450208a41e49385872',
      97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
    },
    router: [
      customRouter.pancake,
      customRouter.pancake,
      customRouter.pancake,
      customRouter.pancake,
      customRouter.pancake,
      customRouter.pancake,
    ],
    factory: [
      customFactory.pancake,
      customFactory.pancake,
      customFactory.pancake,
      customFactory.pancake,
      customFactory.pancake,
      customFactory.pancake,
    ],
    initCodeHash: [
      customInitCodeHash.pancake,
      customInitCodeHash.pancake,
      customInitCodeHash.pancake,
      customInitCodeHash.pancake,
      customInitCodeHash.pancake,
      customInitCodeHash.pancake,
    ],
    fee: {
      management: 0.2,
      buyback: 1.5,
      // bounty: 0.3,
    },
    ratio: [
      // THG, AXS, MBOX, TLM, ALICE, BUSD
      {
        symbol: 'THG',
        value: 10,
        color: '#00f059',
        address: THG,
      },
      {
        symbol: 'AXS',
        value: 30,
        color: '#00ebfc',
        address: AXS,
      },
      {
        symbol: 'MBOX',
        value: 30,
        color: '#0247dc',
        address: MBOX,
      },
      {
        symbol: 'TLM',
        value: 10,
        color: '#eacb7d',
        address: TLM,
      },
      {
        symbol: 'ALICE',
        value: 10,
        color: '#e88095',
        address: ALICE,
      },
      {
        symbol: 'BUSD',
        value: 10,
        color: '#eeb80c',
        address: BUSD,
      },
    ],
    factsheet: {
      name: 'Game Index',
      inceptionDate: 'Wednesday, November 1, 2021 15:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0xB7d9f0aEdFd9270f3BD676450208a41e49385872',
      management: '',
      finixBuyBackFee: '',
      bountyFee: '',
    },
  },
  // {
  //   title: 'DeFi Time',
  //   description: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  //   fullDescription: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  //   icon: ['/images/vaults/defi1.png', '/images/vaults/defi2.png'],
  //   address: {
  //     56: '0xC6dFB6b0A7c401C92c46869Bcf53048f9FC27Fd9',
  //     97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
  //   },
  //   router: [
  //     customRouter.pancake,
  //     customRouter.apeswap,
  //     customRouter.pancake,
  //     customRouter.pancake,
  //     customRouter.pancake,
  //   ],
  //   factory: [
  //     customFactory.pancake,
  //     customFactory.apeswap,
  //     customFactory.pancake,
  //     customFactory.pancake,
  //     customFactory.pancake,
  //   ],
  //   initCodeHash: [
  //     customInitCodeHash.pancake,
  //     customInitCodeHash.apeswap,
  //     customInitCodeHash.pancake,
  //     customInitCodeHash.pancake,
  //     customInitCodeHash.pancake,
  //   ],
  //   fee: {
  //     management: 0.2,
  //     buyback: 1.5,
  //     // bounty: 0.3,
  //   },
  //   ratio: [
  //     // CAKE, SUSHI, UNI, ALPHA, DODO
  //     {
  //       symbol: 'CAKE',
  //       value: 20,
  //       color: '#4cd8de',
  //       address: CAKE,
  //     },
  //     {
  //       symbol: 'SUSHI',
  //       value: 20,
  //       color: '#d164ae',
  //       address: SUSHI,
  //     },
  //     {
  //       symbol: 'UNI',
  //       value: 20,
  //       color: '#ff007d',
  //       address: UNI,
  //     },
  //     {
  //       symbol: 'ALPHA',
  //       value: 20,
  //       color: '#28b2ff',
  //       address: ALPHA,
  //     },
  //     {
  //       symbol: 'DODO',
  //       value: 20,
  //       color: '#ffe801',
  //       address: DODO,
  //     },
  //   ],
  //   factsheet: {
  //     name: 'DeFi Time',
  //     inceptionDate: 'Wednesday, November 1, 2021 15:00:00 (UTC+7)',
  //     manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
  //     vault: '0xC6dFB6b0A7c401C92c46869Bcf53048f9FC27Fd9',
  //     management: '',
  //     finixBuyBackFee: '',
  //     bountyFee: '',
  //   },
  // },
  // {
  //   title: 'Top Coin Collector',
  //   description:
  //     'Famous capital in the farm and highly versatile to the market. The rebalancing will trigger once the value of the farm is covered for the rebalancing fee +1%.',
  //   fullDescription:
  //     'Consisting of BTC ETH USDT which is a big capital farm, but with a lower fluctuation exposure to the market as the biggest ratio is in USDT and other assets are distributed equally. The rebalancing occurs every time an extra 1% coverage movement occurs.',
  //   icon: ['/images/vaults/top1.png', '/images/vaults/top2.png'],
  //   address: {
  //     56: '0xE915f3a2Bb715f6258A5F6d3902b80D42330c0B6',
  //     97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
  //   },
  //   router: [customRouter.definix, customRouter.definix, customRouter.pancake],
  //   factory: [customFactory.definix, customFactory.definix, customFactory.pancake],
  //   initCodeHash: [customInitCodeHash.definix, customInitCodeHash.definix, customInitCodeHash.pancake],
  //   fee: {
  //     management: 0.2,
  //     buyback: 1.5,
  //     // bounty: 0.3,
  //   },
  //   ratio: [
  //     {
  //       symbol: 'BTCB',
  //       value: 25,
  //       color: '#ef9244',
  //       address: BTCB,
  //     },
  //     {
  //       symbol: 'ETH',
  //       value: 25,
  //       color: '#6D6D6D',
  //       address: ETH,
  //     },
  //     {
  //       symbol: 'BUSD',
  //       value: 50,
  //       color: '#eeb80c',
  //       address: BUSD,
  //     },
  //   ],
  //   factsheet: {
  //     name: 'Top Coin Collector',
  //     inceptionDate: 'Wednesday, November 1, 2021 15:00:00 (UTC+7)',
  //     manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
  //     vault: '0xE915f3a2Bb715f6258A5F6d3902b80D42330c0B6',
  //     management: '',
  //     finixBuyBackFee: '',
  //     bountyFee: '',
  //   },
  // },
  {
    title: 'Satoshi and Friends',
    description:
      'Tribute to the founder of BTC. The rebalancing will trigger every 4 hour based on algorithmatic interval based schedule.',
    fullDescription:
      'Consisting of BTC ETH XRP USDT which is a big capital coin with lower rate of fluctuation than the small market cap coins. The highlight which is BTC with the biggest ratio will levitate the performance along with risk allocation in other coins every 4 hours to rebalancing.',
    icon: ['/images/vaults/satoshi1.png', '/images/vaults/satoshi2.png'],
    address: {
      56: '0xD7f63315447cdA14Af30E8DF7E79A89e228Df834',
      97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
    },
    router: [customRouter.definix, customRouter.definix, customRouter.definix, customRouter.pancake],
    factory: [customFactory.definix, customFactory.definix, customFactory.definix, customFactory.pancake],
    initCodeHash: [
      customInitCodeHash.definix,
      customInitCodeHash.definix,
      customInitCodeHash.definix,
      customInitCodeHash.pancake,
    ],
    fee: {
      management: 0.2,
      buyback: 1.5,
      // bounty: 0.3,
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
      {
        symbol: 'XRP',
        value: 20,
        color: '#23292e',
        address: XRP,
      },
      {
        symbol: 'USDT',
        value: 20,
        color: '#2A9D8F',
        address: USDT,
      },
    ],
    factsheet: {
      name: 'Satoshi and Friends',
      inceptionDate: 'Wednesday, November 1, 2021 15:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0xD7f63315447cdA14Af30E8DF7E79A89e228Df834',
      management: '',
      finixBuyBackFee: '',
      bountyFee: '',
    },
  },
  // {
  //   title: 'Big Cap One Plus',
  //   description:
  //     'Leading crypto currencies in the industry. The rebalancing will trigger once the value of the farm is cover the rebalancing fee +1%.',
  //   fullDescription:
  //     'Consisting of BTC ETH BNB USDT which is a big capital with lower rate of fluctuation than the smaller market cap coins, responsible for the performance running along with the top market cap cryptocurrency. The ratio is distributed equally for rebalancing every time an extra 1% coverage movement occurs.',
  //   icon: ['/images/vaults/bigcap1.png', '/images/vaults/bigcap2.png'],
  //   address: {
  //     56: '0x9f3b9cf6552bCDF7161Be1b101c133F24C2282c3',
  //     97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
  //   },
  //   router: [
  //     customRouter.definix,
  //     customRouter.definix,
  //     customRouter.pancake,
  //     customRouter.definix,
  //     customRouter.pancake,
  //   ],
  //   factory: [
  //     customFactory.definix,
  //     customFactory.definix,
  //     customFactory.pancake,
  //     customFactory.definix,
  //     customFactory.pancake,
  //   ],
  //   initCodeHash: [
  //     customInitCodeHash.definix,
  //     customInitCodeHash.definix,
  //     customInitCodeHash.pancake,
  //     customInitCodeHash.definix,
  //     customInitCodeHash.pancake,
  //   ],
  //   fee: {
  //     management: 0.2,
  //     buyback: 1.5,
  //     // bounty: 0.3,
  //   },
  //   ratio: [
  //     {
  //       symbol: 'BTCB',
  //       value: 20,
  //       color: '#ef9244',
  //       address: BTCB,
  //     },
  //     {
  //       symbol: 'ETH',
  //       value: 20,
  //       color: '#6D6D6D',
  //       address: ETH,
  //     },
  //     {
  //       symbol: 'WBNB',
  //       value: 20,
  //       color: '#eeb80c',
  //       address: WBNB,
  //     },
  //     {
  //       symbol: 'XRP',
  //       value: 20,
  //       color: '#23292e',
  //       address: XRP,
  //     },
  //     {
  //       symbol: 'USDT',
  //       value: 20,
  //       color: '#2A9D8F',
  //       address: USDT,
  //     },
  //   ],
  //   factsheet: {
  //     name: 'Big Cap One Plus',
  //     inceptionDate: 'Wednesday, November 1, 2021 15:00:00 (UTC+7)',
  //     manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
  //     vault: '0x9f3b9cf6552bCDF7161Be1b101c133F24C2282c3',
  //     management: '',
  //     finixBuyBackFee: '',
  //     bountyFee: '',
  //   },
  // },
  // {
  //   title: 'Forever Favourite',
  //   description: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  //   fullDescription: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  //   icon: ['/images/vaults/forever1.png', '/images/vaults/forever2.png'],
  //   address: {
  //     56: '0x234339Fb8B171bBeD5658CdbC8B25204C9e54c9e',
  //     97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
  //   },
  //   router: [
  //     customRouter.pancake,
  //     customRouter.pancake,
  //     customRouter.pancake,
  //     customRouter.definix,
  //     customRouter.pancake,
  //   ],
  //   factory: [
  //     customFactory.pancake,
  //     customFactory.pancake,
  //     customFactory.pancake,
  //     customFactory.definix,
  //     customFactory.pancake,
  //   ],
  //   initCodeHash: [
  //     customInitCodeHash.pancake,
  //     customInitCodeHash.pancake,
  //     customInitCodeHash.pancake,
  //     customInitCodeHash.definix,
  //     customInitCodeHash.pancake,
  //   ],
  //   fee: {
  //     management: 0.2,
  //     buyback: 1.5,
  //     // bounty: 0.3,
  //   },
  //   ratio: [
  //     {
  //       symbol: 'DOGE',
  //       value: 20,
  //       color: '#ba9f32',
  //       address: DOGE,
  //     },
  //     {
  //       symbol: 'LTC',
  //       value: 20,
  //       color: '#345d9c',
  //       address: LTC,
  //     },
  //     {
  //       symbol: 'DOT',
  //       value: 20,
  //       color: '#e7027b',
  //       address: DOT,
  //     },
  //     {
  //       symbol: 'ADA',
  //       value: 20,
  //       color: '#0031af',
  //       address: ADA,
  //     },
  //     {
  //       symbol: 'WBNB',
  //       value: 20,
  //       color: '#eeb80c',
  //       address: WBNB,
  //     },
  //   ],
  //   factsheet: {
  //     name: 'Forever Favourite',
  //     inceptionDate: 'Wednesday, November 1, 2021 15:00:00 (UTC+7)',
  //     manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
  //     vault: '0x234339Fb8B171bBeD5658CdbC8B25204C9e54c9e',
  //     management: '',
  //     finixBuyBackFee: '',
  //     bountyFee: '',
  //   },
  // },
  {
    title: 'ALT Party',
    description:
      'Designed for Alt coin advocate. The rebalancing will trigger every hour based on algorithmatic interval based schedule.',
    fullDescription:
      'Consisting of ETH XRP BNB USDT with a higher rate of fluctuation in the top market cap coin category. This farm has allocated the risk to the stablecoin and rebalancing strategy is applied every 1 hour.',
    icon: ['/images/vaults/alt1.png', '/images/vaults/alt2.png'],
    address: {
      56: '0x15edf6330e74B98172A33C351cEfBeF6e9b85bC6',
      97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
    },
    router: [customRouter.definix, customRouter.definix, customRouter.pancake, customRouter.pancake],
    factory: [customFactory.definix, customFactory.definix, customFactory.pancake, customFactory.pancake],
    initCodeHash: [
      customInitCodeHash.definix,
      customInitCodeHash.definix,
      customInitCodeHash.pancake,
      customInitCodeHash.pancake,
    ],
    fee: {
      management: 0.2,
      buyback: 1.5,
      // bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'ETH',
        value: 30,
        color: '#6D6D6D',
        address: ETH,
      },
      {
        symbol: 'XRP',
        value: 30,
        color: '#23292e',
        address: XRP,
      },
      {
        symbol: 'WBNB',
        value: 30,
        color: '#eeb80c',
        address: WBNB,
      },
      {
        symbol: 'USDT',
        value: 10,
        color: '#2A9D8F',
        address: USDT,
      },
    ],
    factsheet: {
      name: 'ALT Party',
      inceptionDate: 'Wednesday, November 1, 2021 15:00:00 (UTC+7)',
      manager: '0xED350352eb3C509D0D8A70aE0BC01B173EbA41D7',
      vault: '0x15edf6330e74B98172A33C351cEfBeF6e9b85bC6',
      management: '',
      finixBuyBackFee: '',
      bountyFee: '',
    },
  },
]

export default rebalances
