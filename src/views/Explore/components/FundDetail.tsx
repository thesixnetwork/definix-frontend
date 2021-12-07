import React from 'react'
import { Text } from 'definixswap-uikit'

import { useTranslation } from 'react-i18next'
import { Rebalance } from 'state/types'

import FullAssetRatio from './FullAssetRatio'

interface FundDetailType {
  rebalance?: Rebalance | any
}

const FundDetail: React.FC<FundDetailType> = ({ rebalance }) => {
  const { t } = useTranslation()

  const { ratio } = rebalance
  return (
    <>
      <Text textStyle="R_16M" color="deepgrey" pb="S_20">
        {t('Asset Ratio')}
      </Text>
      <FullAssetRatio ratio={ratio} />
    </>
  )
}

export default FundDetail
