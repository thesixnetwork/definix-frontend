import { MenuEntry } from 'uikit-dev'
import farmClick from 'uikit-dev/images/Menu-Icon/farm-click.png'
import farm from 'uikit-dev/images/Menu-Icon/farm.png'
import liquidityClick from 'uikit-dev/images/Menu-Icon/liquidity-click.png'
import liquidity from 'uikit-dev/images/Menu-Icon/liquidity.png'
import poolClick from 'uikit-dev/images/Menu-Icon/pool-click.png'
import pool from 'uikit-dev/images/Menu-Icon/pool.png'
import swapClick from 'uikit-dev/images/Menu-Icon/swap-click.png'
import swap from 'uikit-dev/images/Menu-Icon/swap.png'
import dashboardClick from 'uikit-dev/images/Menu-Icon/dashboard-click.png'
import dashboard from 'uikit-dev/images/Menu-Icon/dashboard.png'

const config: MenuEntry[] = [
  {
    label: 'Dashboard',
    icon: dashboardClick,
    iconActive: dashboard,
    href: '/dashboard',
  },
  {
    label: 'Pool',
    icon: poolClick,
    iconActive: pool,
    href: '/pool',
  },
  {
    label: 'Swap',
    icon: swapClick,
    iconActive: swap,
    href: 'https://exchange.definix.com/#/swap',
  },
  {
    label: 'Liquidity',
    icon: liquidityClick,
    iconActive: liquidity,
    href: 'https://exchange.definix.com/#/liquidity',
  },
  {
    label: 'Farm',
    icon: farmClick,
    iconActive: farm,
    href: '/farm',
  },
  // {
  //   label: 'Investment',
  //   icon: 'TradeIcon',
  //   initialOpenState: false,
  //   items: [
  //     {
  //       label: 'Exchange',
  //       href: '/swap',
  //     },
  //     {
  //       label: 'Liquidity',
  //       href: '/pool',
  //     },
  //   ],
  // },
]

// const config: MenuEntry[] = [
//   {
//     label: 'Home',
//     icon: 'HomeIcon',
//     href: 'https://definixswap.finance/',
//   },
//   {
//     label: 'Trade',
//     icon: 'TradeIcon',
//     initialOpenState: true,
//     items: [
//       {
//         label: 'Exchange',
//         href: '/swap',
//       },
//       {
//         label: 'Liquidity',
//         href: '/pool',
//       },
//     ],
//   },
//   {
//     label: 'Farms',
//     icon: 'FarmIcon',
//     href: 'https://definixswap.finance/farms',
//   },
//   {
//     label: 'Pools',
//     icon: 'PoolIcon',
//     href: 'https://definixswap.finance/syrup',
//   },
//   {
//     label: 'Lottery',
//     icon: 'TicketIcon',
//     href: 'https://definixswap.finance/lottery',
//   },
//   {
//     label: 'NFT',
//     icon: 'NftIcon',
//     href: 'https://definixswap.finance/nft',
//   },
//   {
//     label: 'Teams & Profile',
//     icon: 'GroupsIcon',
//     items: [
//       {
//         label: 'Leaderboard',
//         href: 'https://definixswap.finance/teams',
//       },
//       {
//         label: 'Your Profile',
//         href: 'https://definixswap.finance/profile',
//       },
//     ],
//   },
//   {
//     label: 'Info',
//     icon: 'InfoIcon',
//     items: [
//       {
//         label: 'Overview',
//         href: 'https://definixswap.info',
//       },
//       {
//         label: 'Tokens',
//         href: 'https://definixswap.info/tokens',
//       },
//       {
//         label: 'Pairs',
//         href: 'https://definixswap.info/pairs',
//       },
//       {
//         label: 'Accounts',
//         href: 'https://definixswap.info/accounts',
//       },
//     ],
//   },
//   {
//     label: 'IFO',
//     icon: 'IfoIcon',
//     href: 'https://definixswap.finance/ifo',
//   },
//   {
//     label: 'More',
//     icon: 'MoreIcon',
//     items: [
//       {
//         label: 'Voting',
//         href: 'https://voting.definixswap.finance',
//       },
//       {
//         label: 'Github',
//         href: 'https://github.com/definixswap',
//       },
//       {
//         label: 'Docs',
//         href: 'https://docs.definixswap.finance',
//       },
//       {
//         label: 'Blog',
//         href: 'https://definixswap.medium.com',
//       },
//     ],
//   },
// ]

export default config
