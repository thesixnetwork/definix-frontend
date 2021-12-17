import React, { useEffect } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Menu as UikitMenu } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation, Trans } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { supportedLanguages } from 'config/localisation/languageCodes'
import useTheme from 'hooks/useTheme'
import useUserSlippageTolerance from 'hooks/useUserSlippageTolerance'
import useUserDeadline from 'hooks/useUserDeadline'
import { links } from './config'

const Menu = (props) => {
  const { account, connect, reset } = useWallet()
  const { i18n, t } = useTranslation()
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [deadline, setDeadline] = useUserDeadline()
  const { isDark, toggleTheme } = useTheme()
  // const finixPriceUsd = usePriceFinixUsd()
  // const { profile } = useProfile()
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <UikitMenu
      Link={Link}
      // SettingsModal slippage
      userSlippageTolerance={userSlippageTolerance}
      setUserslippageTolerance={setUserslippageTolerance}
      // SettingsModal deadline
      deadline={deadline}
      setDeadline={setDeadline}
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

export default Menu
