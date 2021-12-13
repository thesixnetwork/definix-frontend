import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import CurrencyText from 'components/CurrencyText'
import TwoLineFormat from './TwoLineFormat'

interface SharePriceType {
  price: number
  diff?: number
  small?: boolean
  titleMarginBottom?: number
}

const SharePrice: React.FC<SharePriceType> = ({ price, diff, small, titleMarginBottom }) => {
  const { t } = useTranslation()
  return diff !== null ? (
    <TwoLineFormat
      titleMarginBottom={titleMarginBottom}
      large={!small}
      title={t('Share Price')}
      subTitle={`(${t('Since Inception')})`}
      value={<CurrencyText value={price} />}
      percent={`${diff >= 0 ? `+${numeral(diff).format('0,0.[00]')}` : `${numeral(diff).format('0,0.[00]')}`}%`}
      percentClass={(() => {
        if (diff < 0) return 'failure'
        if (diff > 0) return 'success'
        return ''
      })()}
    />
  ) : (
    <TwoLineFormat
      titleMarginBottom={titleMarginBottom}
      large={!small}
      title={t('Share Price')}
      value={`$${numeral(price).format('0,0.00')}`}
    />
  )
}

export default SharePrice
