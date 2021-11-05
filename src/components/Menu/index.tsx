import React from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { supportedLanguages } from 'config/localisation/languageCodes'
import useTheme from 'hooks/useTheme'
import { usePriceFinixUsd, useProfile } from 'state/hooks'
import { Menu as UikitMenu } from 'definixswap-uikit'
import useTranslation, { Trans } from 'contexts/Localisation/useTranslation'
import { links } from './config'
// import { Menu as UikitMenu } from 'uikit-dev'

const Menu = (props) => {
  const { account, connect, reset } = useWallet()
  const { setLangCode, selectedLangCode, t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const finixPriceUsd = usePriceFinixUsd()
  const { profile } = useProfile()

  return (
    <UikitMenu
      t={t}
      Trans={Trans}
      account={account}
      login={connect}
      logout={reset}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLangCode}
      langs={supportedLanguages}
      setLang={({ code }) => setLangCode(code)}
      // finixPriceUsd={finixPriceUsd.toNumber()}
      // price={finixPriceUsd.toNumber() <= 0 ? 'N/A' : numeral(finixPriceUsd.toNumber()).format('0,0.0000')}
      links={links}
      profile={{
        username: profile?.username,
        image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
        profileLink: '/profile',
        noProfileLink: '/profile',
        showPip: !profile?.username,
      }}
      {...props}
    />
  )
}

export default Menu
