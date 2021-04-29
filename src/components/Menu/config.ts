import { MenuEntry } from 'uikit-dev'
import bridgeClick from 'uikit-dev/images/Menu-Icon/bridge-click.png'
import bridge from 'uikit-dev/images/Menu-Icon/bridge.png'
import dashboardClick from 'uikit-dev/images/Menu-Icon/dashboard-click.png'
import dashboard from 'uikit-dev/images/Menu-Icon/dashboard.png'
import farmClick from 'uikit-dev/images/Menu-Icon/farm-click.png'
import farm from 'uikit-dev/images/Menu-Icon/farm.png'
import liquidityClick from 'uikit-dev/images/Menu-Icon/liquidity-click.png'
import liquidity from 'uikit-dev/images/Menu-Icon/liquidity.png'
import partnerClick from 'uikit-dev/images/Menu-Icon/partnership-click.png'
import partner from 'uikit-dev/images/Menu-Icon/partnership.png'
import portfolioClick from 'uikit-dev/images/Menu-Icon/portfolio-click.png'
import portfolio from 'uikit-dev/images/Menu-Icon/portfolio.png'
import swapClick from 'uikit-dev/images/Menu-Icon/swap-click.png'
import swap from 'uikit-dev/images/Menu-Icon/swap.png'
import exploreClick from 'uikit-dev/images/Menu-Icon/explore-click.png'
import explore from 'uikit-dev/images/Menu-Icon/explore.png'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: dashboardClick,
    iconActive: dashboard,
    href: '/dashboard',
    notHighlight: false,
    newTab: false,
  },
  {
    label: 'Exchange',
    icon: swapClick,
    iconActive: swap,
    href: 'https://exchange.definix.com/#/swap',
    notHighlight: false,
    newTab: false,
  },
  {
    label: 'Liquidity',
    icon: liquidityClick,
    iconActive: liquidity,
    href: 'https://exchange.definix.com/#/liquidity',
    notHighlight: false,
    newTab: false,
  },
  {
    label: 'Yield Farming',
    icon: farmClick,
    iconActive: farm,
    href: '/farm',
    notHighlight: false,
    newTab: false,
    items: [
      {
        label: 'Farm',
        href: '/farm',
        notHighlight: false,
        newTab: false,
      },
      {
        label: 'Pool',
        href: '/pool',
        notHighlight: false,
        newTab: false,
      },
    ],
  },
  {
    label: 'Mutual Fund',
    icon: portfolioClick,
    iconActive: portfolio,
    href: '/info',
    notHighlight: false,
    newTab: false,
    items: [
      {
        label: 'Portfolio',
        href: '/info',
        notHighlight: true,
        newTab: false,
      },
      {
        label: 'Watchlist',
        href: '/info',
        notHighlight: true,
        newTab: false,
      },
      {
        label: 'Explore',
        href: '/info',
        notHighlight: true,
        newTab: false,
      },
    ],
  },
  {
    label: 'Bridge',
    icon: bridgeClick,
    iconActive: bridge,
    href: 'https://bridge.six.network',
    notHighlight: true,
    newTab: false,
  },
  {
    label: 'Tutorial',
    icon: exploreClick,
    iconActive: explore,
    href: '/',
    notHighlight: true,
    newTab: false,
  },
  {
    label: 'Blogs',
    icon: exploreClick,
    iconActive: explore,
    href: '/',
    notHighlight: true,
    newTab: true,
  },
  {
    label: 'Partnership',
    icon: partnerClick,
    iconActive: partner,
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSfKMRNlTsTCk__s4v_qnwE3Uw4-kro8XRMPVQTS5OE6zX2Uqg/viewform',
    notHighlight: true,
    newTab: true,
  },
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
