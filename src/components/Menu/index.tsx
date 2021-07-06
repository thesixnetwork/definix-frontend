import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useTranslation } from 'contexts/Localization'
import { languageList } from 'config/localization/languages'
import useTheme from 'hooks/useTheme'
import React, { useContext } from 'react'
import { usePriceFinixUsd, useProfile } from 'state/hooks'
import { Menu as UikitMenu } from 'uikit-dev'
import config from './config'

const Menu = (props) => {
  const { account, connect, reset } = useWallet()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const finixPriceUsd = usePriceFinixUsd()
  const { profile } = useProfile()

  return (
    <UikitMenu
      account={account}
      login={connect}
      logout={reset}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      finixPriceUsd={finixPriceUsd.toNumber()}
      price={finixPriceUsd.toNumber()}
      links={config}
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
