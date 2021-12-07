import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import TwoLineFormat from './TwoLineFormat'

interface TotalAssetValueType {
  value: number
  small?: boolean
}

const TotalAssetValue: React.FC<TotalAssetValueType> = ({ value, small }) => {
  const { t } = useTranslation()
  return <TwoLineFormat title={t('Total Asset Value')} value={`$${numeral(value).format('0,0.00')}`} large={!small} />
}

export default TotalAssetValue
