import { ROUTES } from 'config/constants/routes'
import { AvailableConnectors } from '@fingerlabs/klaytn-wallets'

export const links = (t: (key: string) => string, currentLang: string) => {
  return [
    {
      label: t('Home'),
      icon: 'GnbHomeNIcon',
      activeIcon: 'GnbHomeSIcon',
      href: ROUTES.HOME,
    },
    {
      label: t('Exchange'),
      icon: 'GnbExchangeNIcon',
      activeIcon: 'GnbExchangeSIcon',
      items: [
        {
          label: t('Menu Swap'),
          href: ROUTES.SWAP,
        },
        {
          label: t('Liquidity'),
          href: ROUTES.LIQUIDITY,
        },
      ],
    },
    {
      label: t('Yield Farming'),
      icon: 'GnbFarmingNIcon',
      activeIcon: 'GnbFarmingSIcon',
      items: [
        {
          label: t('Farm'),
          href: ROUTES.FARM,
        },
        {
          label: t('Pool'),
          href: ROUTES.POOL,
        },
      ],
    },
    {
      label: t('Rebalancing'),
      icon: 'GnbRebalancingNIcon',
      activeIcon: 'GnbRebalancingSIcon',
      href: ROUTES.REBALANCING,
    },
    {
      label: t('vFINIX'),
      icon: 'GnbFinixNIcon',
      activeIcon: 'GnbFinixSIcon',
      items: [
        {
          label: t('Long-term Stake'),
          href: ROUTES.LONG_TERM_STAKE,
        },
        {
          label: t('Voting'),
          href: ROUTES.VOTING,
        },
      ],
    },
    {
      label: t('Bridge'),
      icon: 'GnbBridgeNIcon',
      activeIcon: 'GnbBridgeSIcon',
      href: ROUTES.BRIDGE,
    },
    {
      label: t('More'),
      icon: 'GnbMoreNIcon',
      activeIcon: 'GnbMoreNIcon',
      items: [
        {
          label: t('Document'),
          href:
            currentLang === 'ko'
              ? 'https://sixnetwork.gitbook.io/definix-on-klaytn-kr/'
              : 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/',
          target: '_blank',
        },
        {
          label: t('Feedback'),
          href: 'https://forms.gle/x9rfWuzD9Kpa8xa47',
          target: '_blank',
        },
      ],
    },
  ]
}

export const connectors = [
  {
    title: 'Kaikas',
    icon: 'Kaikas',
    connectorId: AvailableConnectors.KAIKAS,
  },
  {
    title: 'D`CENT',
    icon: 'Dcent',
    connectorId: AvailableConnectors.DCENT,
  },
  // {
  //   title: 'TokenPocket',
  //   icon: 'TokenPocket',
  //   width: 52,
  //   height: 52,
  //   connectorId: AvailableConnectors.Injected,
  // },
  {
    title: 'Klip',
    icon: 'KlipConnect',
    width: 48,
    height: 24,
    connectorId: AvailableConnectors.KLIP,
  },
]

export const socials = [
  {
    label: 'facebook',
    icon: 'FooterFacebookIcon',
    href: 'https://www.facebook.com/thesixnetwork',
  },
  {
    label: 'Twitter',
    icon: 'FooterTwitterIcon',
    href: 'https://twitter.com/DefinixOfficial',
  },
  {
    label: 'telegram',
    icon: 'FooterTelegramIcon',
    href: 'https://t.me/SIXNetwork',
  },
  {
    label: 'kakao',
    icon: 'FooterKakaotalkIcon',
    href: 'https://open.kakao.com/o/gsh5pWGd',
  },
  {
    label: 'gitbook',
    icon: 'FooterGitbookIcon',
    href: 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/',
  },
  {
    label: 'github',
    icon: 'FooterGithubIcon',
    href: 'https://github.com/thesixnetwork',
  },
  {
    label: 'reddit',
    icon: 'FooterRedditIcon',
    href: 'https://www.reddit.com/r/sixnetwork',
  },
]
