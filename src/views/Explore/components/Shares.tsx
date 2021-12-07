import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import TwoLineFormat from './TwoLineFormat'

interface SharesType {
  balance: number
  small?: boolean
}

const Shares: React.FC<SharesType> = ({ balance, small }) => {
  const { t } = useTranslation()
  return (
    <TwoLineFormat
      large={!small}
      title={t('Shares')}
      value={`${numeral(balance).format('0,0.[00]')}`}
      hint={t('A return of investment paid')}
    />
  )
}

export default Shares
