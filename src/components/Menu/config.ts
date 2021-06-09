import { MenuEntry } from 'uikit-dev'
import newIcon from 'uikit-dev/images/for-trading-challenge/New-icon.png'
import farmBlack from 'uikit-dev/images/for-ui-v2/menu/Farm-Black.png'
import farmWhite from 'uikit-dev/images/for-ui-v2/menu/Farm-White.png'
import homeBlack from 'uikit-dev/images/for-ui-v2/menu/Home-Black.png'
import homeWhite from 'uikit-dev/images/for-ui-v2/menu/Home-White.png'
import liquidityBlack from 'uikit-dev/images/for-ui-v2/menu/Liquidity-Black.png'
import liquidityWhite from 'uikit-dev/images/for-ui-v2/menu/Liquidity-White.png'
import mutualBlack from 'uikit-dev/images/for-ui-v2/menu/Mutual-fund-Black.png'
import mutualWhite from 'uikit-dev/images/for-ui-v2/menu/Mutual-fund-White.png'
import swapBlack from 'uikit-dev/images/for-ui-v2/menu/Swap-Black.png'
import swapWhite from 'uikit-dev/images/for-ui-v2/menu/Swap-White.png'
import bridgeClick from 'uikit-dev/images/Menu-Icon/bridge-click.png'
import bridge from 'uikit-dev/images/Menu-Icon/bridge.png'
import gitbookClick from 'uikit-dev/images/Menu-Icon/Gitbook-click.png'
import gitbook from 'uikit-dev/images/Menu-Icon/Gitbook.png'
import partnerClick from 'uikit-dev/images/Menu-Icon/partnership-click.png'
import partner from 'uikit-dev/images/Menu-Icon/partnership.png'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: homeBlack,
    iconActive: homeWhite,
    href: '/',
    notHighlight: false,
    newTab: false,
  },
  {
    label: 'Exchange',
    icon: swapBlack,
    iconActive: swapWhite,
    href: 'https://d366rehkco0qdz.cloudfront.net/#/swap',
    notHighlight: false,
    newTab: false,
  },
  {
    label: 'Liquidity',
    icon: liquidityBlack,
    iconActive: liquidityWhite,
    href: 'https://d366rehkco0qdz.cloudfront.net/#/liquidity',
    notHighlight: false,
    newTab: false,
  },
  {
    label: 'Yield Farming',
    icon: farmBlack,
    iconActive: farmWhite,
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
  // {
  //   label: 'Register',
  //   icon: newIcon,
  //   iconActive: newIcon,
  //   calloutClass: 'new',
  //   href: '/trading-challenge',
  //   group: 'trading',
  //   notHighlight: false,
  //   newTab: false,
  // },
  {
    label: 'Leaderboard',
    icon: newIcon,
    iconActive: newIcon,
    calloutClass: 'new',
    href: '/leaderboard',
    notHighlight: false,
    newTab: false,
  },
  {
    label: 'Mutual Fund',
    icon: mutualBlack,
    iconActive: mutualWhite,
    href: '/info',
    notHighlight: false,
    newTab: false,
    items: [
      {
        label: 'Investors',
        href: '/info',
        notHighlight: true,
        newTab: false,
      },
      {
        label: 'Fund Managers',
        href: '/info',
        notHighlight: true,
        newTab: false,
      },
      {
        label: 'Network Monitor',
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
  // {
  //   label: 'Tutorial',
  //   icon: exploreClick,
  //   iconActive: explore,
  //   href: '#',
  //   notHighlight: true,
  //   newTab: false,
  // },
  // {
  //   label: 'Blogs',
  //   icon: exploreClick,
  //   iconActive: explore,
  //   href: '#',
  //   notHighlight: true,
  //   newTab: true,
  // },
  {
    label: 'Gitbook',
    icon: gitbookClick,
    iconActive: gitbook,
    href: 'https://app.gitbook.com/@sixnetwork/s/definix/',
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
