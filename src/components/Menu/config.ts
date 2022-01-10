export const links = (t: (key: string) => string, currentLang: string) => {
  return [
    {
      label: t('Home'),
      icon: 'GnbHomeNIcon',
      activeIcon: 'GnbHomeSIcon',
      href: '/',
    },
    {
      label: t('Exchange'),
      icon: 'GnbExchangeNIcon',
      activeIcon: 'GnbExchangeSIcon',
      items: [
        {
          label: t('Menu Swap'),
          href: `/swap`,
        },
        {
          label: t('Liquidity'),
          href: `/liquidity/add`,
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
      label: t('vFINIX'),
      icon: 'GnbFinixNIcon',
      activeIcon: 'GnbFinixSIcon',
      items: [
        {
          label: t('Long-term Stake'),
          href: '/long-term-stake',
        },
        {
          label: t('Voting'),
          href: '/voting',
        },
      ],
    },
    {
      label: t('Bridge'),
      icon: 'GnbBridgeNIcon',
      activeIcon: 'GnbBridgeSIcon',
      href: '/bridge',
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
