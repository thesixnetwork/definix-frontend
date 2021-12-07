import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import TwoLineFormat from './TwoLineFormat'

interface SharePriceType {
  price: number
  diff: number
  small?: boolean
  titleMarginBottom?: number
}

const SharePrice: React.FC<SharePriceType> = ({ price, diff, small, titleMarginBottom }) => {
  const { t } = useTranslation()
  return (
    <TwoLineFormat
      titleMarginBottom={titleMarginBottom}
      large={!small}
      title={t('Share Price (Since Inception)')}
      value={`$${numeral(price).format('0,0.00')}`}
      percent={`${diff >= 0 ? `+${numeral(diff).format('0,0.[00]')}` : `${numeral(diff).format('0,0.[00]')}`}%`}
      percentClass={(() => {
        if (diff < 0) return 'failure'
        if (diff > 0) return 'success'
        return ''
      })()}
    />
  )
}

export default SharePrice
