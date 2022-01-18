import React from 'react'
import { useTranslation } from 'react-i18next'
import CurrencyText from 'components/Text/CurrencyText'
import TwoLineFormat from './TwoLineFormat'

interface TotalAssetValueType {
  value: number
  small?: boolean
}

const TotalAssetValue: React.FC<TotalAssetValueType> = ({ value, small }) => {
  const { t } = useTranslation()
  return <TwoLineFormat title={t('Total Asset Value')} value={<CurrencyText value={value} />} large={!small} />
}

export default TotalAssetValue
