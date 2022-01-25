import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import useConverter from 'hooks/useConverter'
import TwoLineFormat from './TwoLineFormat'

interface YieldAPRType {
  finixRewardPerYear: BigNumber
  totalAssetValue: BigNumber
  small?: boolean
}

const YieldAPR: React.FC<YieldAPRType> = ({ finixRewardPerYear, totalAssetValue, small }) => {
  const { t } = useTranslation()
  const { convertToRebalanceAPRFormat } = useConverter()
  const apr = useMemo(() => {
    return convertToRebalanceAPRFormat({
      finixRewardPerYear: finixRewardPerYear || new BigNumber(0),
      totalAssetValue: totalAssetValue || new BigNumber(0),
    })
  }, [convertToRebalanceAPRFormat, finixRewardPerYear, totalAssetValue])
  return (
    <TwoLineFormat title={t('Yield APR')} value={`${apr}%`} hint={t('A return of investment paid')} large={!small} />
  )
}

export default YieldAPR
