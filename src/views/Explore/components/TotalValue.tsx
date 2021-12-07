import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import TwoLineFormat from './TwoLineFormat'

interface TotalValueType {
  balance: number
  price: number
  small?: boolean
}

const TotalValue: React.FC<TotalValueType> = ({ balance, price, small }) => {
  const { t } = useTranslation()
  return (
    <TwoLineFormat large={!small} title={t('Total Value')} value={`$${numeral(balance * price).format('0,0.[00]')}`} />
  )
}

export default TotalValue
