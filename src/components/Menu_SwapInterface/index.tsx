import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { injected, klip } from 'connectors'
import { allLanguages } from 'config/constants/localisation/languageCodes'
import { LanguageContext } from 'hooks/LanguageContext'
import useGetLocalProfile from 'hooks/useGetLocalProfile'
import useGetPriceData from 'hooks/useGetPriceData'
import useTheme from 'hooks/useTheme'
import React, { useContext } from 'react'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { ConnectorId, Menu as UikitMenu } from 'uikit-dev'
import numeral from 'numeral'
import links from './config'
import useFinixPrice from '../../hooks/useFinixPrice'

const Menu: React.FC = (props) => {
  const { setShowModal, showModal } = React.useContext(KlipModalContext())
  const { account, activate, deactivate } = useCaverJsReact()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const priceData = useGetPriceData()
  const finixPrice = useFinixPrice()
  const finixPriceUsd = priceData ? Number(priceData.prices.Finix) : undefined
  const profile = useGetLocalProfile()
  const showModalKlip = () => {
    setShowModal(true)
  }
  const closeModalKlip = () => {
    setShowModal(false)
  }
  return (
    <UikitMenu
      links={links}
      account={account as string}
      login={(connectorId: ConnectorId) => {
        if (connectorId === 'klip') {
          window.localStorage.setItem('connector', 'klip')
          return activate(klip(showModalKlip, closeModalKlip))
        }
        window.localStorage.setItem('connector', 'injected')
        return activate(injected)
      }}
      logout={deactivate}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage?.code || 'en'}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      finixPriceUsd={finixPriceUsd}
      profile={profile}
      price={finixPrice <= 0 ? 'N/A' : numeral(finixPrice).format('0,0.0000')}
      {...props}
    />
  )
}

export default Menu
