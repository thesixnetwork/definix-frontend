export const links = (t: (key: string) => string) => {
  return [
    {
      label: t('Home'),
      icon: 'GnbHomeNIcon',
      activeIcon: 'GnbHomeSIcon',
      href: '/',
    },
    {
      label: t('ExChange'),
      icon: 'GnbExchangeNIcon',
      activeIcon: 'GnbExchangeSIcon',
      items: [
        {
          label: t('Swap'),
          href: 'https://exchange.definix.com/#/swap',
        },
        {
          label: t('Liquidity'),
          href: 'https://exchange.definix.com/#/liquidity',
        },
      ],
    },
    {
      label: t('Yield Farming'),
      icon: 'GnbFarmingNIcon',
      activeIcon: 'GnbFarmingNIcon',
      items: [
        {
          label: t('Farm'),
          href: '/farm',
        },
        {
          label: t('Pool'),
          href: '/pool',
        },
      ],
    },
    {
      label: t('Rebalancing'),
      icon: 'GnbRebalancingNIcon',
      activeIcon: 'GnbRebalancingSIcon',
      href: '/rebalancing',
    },
    {
      label: t('Bridge'),
      icon: 'GnbBridgeNIcon',
      activeIcon: 'GnbBridgeSIcon',
      href: '/bridge',
    },
    {
      label: t('MyInvestments'),
      icon: 'GnbBridgeNIcon',
      activeIcon: 'GnbBridgeSIcon',
      href: '/myinvestments',
    },
    {
      label: t('More'),
      icon: 'GnbMoreNIcon',
      activeIcon: 'GnbMoreNIcon',
      items: [
        {
          label: t('GitBook'),
          href: 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/',
        },
        {
          label: t('Partnership'),
          href: 'https://docs.google.com/forms/d/e/1FAIpQLScQcrUmV53N5y-ita6zD4Do8nQ6zdI_Al795jMUK--HSbHU5Q/viewform',
        },
      ],
    },
  ]
}

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
    href: 'https://open.kakao.com/o/gQNRT5K',
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
