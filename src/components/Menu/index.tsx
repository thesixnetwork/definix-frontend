import React, { useEffect } from 'react'
import { Menu as UikitMenu, useModal } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation, Trans } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { supportedLanguages } from 'config/localisation/languageCodes'
import useTheme from 'hooks/useTheme'
import useWallet from 'hooks/useWallet'
import { links } from './config'
import SettingsModal from 'components/SettingModal'

const Menu: React.FC<any> = ({ finixPrice, ...props }) => {
  const { account, connect, reset } = useWallet()

  const { i18n, t } = useTranslation()

  const [onPresentSettingModal] = useModal(
    <SettingsModal />,
    false
  );

  const { isDark, toggleTheme } = useTheme()
  // const finixPriceUsd = usePriceFinixUsd()
  // const { profile } = useProfile()
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <UikitMenu
      finixPrice={finixPrice}
      version={process.env.REACT_APP_VERSION}
      Link={Link}
      onPresentSettingModal={onPresentSettingModal}
      account={account}
      login={connect}
      logout={reset}
      Trans={Trans}
      currentLang={i18n.languages[0]}
      langs={supportedLanguages}
      setLang={({ code }) => i18n.changeLanguage(code)}
      isDark={isDark}
      toggleTheme={toggleTheme}
      links={links(t, i18n.languages[0])}
      {...props}
    />
  )
}

export default React.memo(Menu)
