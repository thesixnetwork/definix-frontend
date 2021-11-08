import React from 'react'
import { useMatchBreakpoints, ChainToggle, ChainToggleItem, ChainBscIcon, ChainKlaytnIcon } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'

const Chain: React.FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <div>
      <ChainToggle toggleScale={isMobile ? 'sm' : 'md'} activeIndex={1}>
        <ChainToggleItem as="a" href="https://bsc.definix.com" startIcon={<ChainBscIcon viewBox="0 0 32 32" />}>
          {t(isMobile ? 'bsc' : 'Binance smart chain')}
        </ChainToggleItem>
        <ChainToggleItem as="a" startIcon={<ChainKlaytnIcon viewBox="0 0 22 22" />}>
          {t('Klaytn chain')}
        </ChainToggleItem>
      </ChainToggle>
    </div>
  )
}

export default React.memo(Chain)
