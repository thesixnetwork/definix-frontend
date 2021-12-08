import React, { useEffect } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Menu as UikitMenu } from 'definixswap-uikit'
import { useTranslation, Trans } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { supportedLanguages } from 'config/localisation/languageCodes'
import useTheme from 'hooks/useTheme'
// import { usePriceFinixUsd, useProfile } from 'state/hooks'
import useUserSlippageTolerance from 'hooks/useUserSlippageTolerance'
import useUserDeadline from 'hooks/useUserDeadline'
import NetWorth from './NetWorth'
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
      // SettingsModal slippage
      userSlippageTolerance={userSlippageTolerance}
      setUserslippageTolerance={setUserslippageTolerance}
      // SettingsModal deadline
      deadline={deadline}
      setDeadline={setDeadline}
      account={account}
      login={connect}
      logout={reset}
      netWorth={<NetWorth />}
      Trans={Trans}
      currentLang={i18n.languages[0]}
      langs={supportedLanguages}
      setLang={({ code }) => i18n.changeLanguage(code)}
      isDark={isDark}
      toggleTheme={toggleTheme}
      links={links(t)}
      // finixPriceUsd={finixPriceUsd.toNumber()}
      // price={finixPriceUsd.toNumber() <= 0 ? 'N/A' : numeral(finixPriceUsd.toNumber()).format('0,0.0000')}
      // profile={{
      //   username: profile?.username,
      //   image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
      //   profileLink: '/profile',
      //   noProfileLink: '/profile',
      //   showPip: !profile?.username,
      // }}
      {...props}
    />
  )
}

export default Menu
