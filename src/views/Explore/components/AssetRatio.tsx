import { Ratio } from 'config/constants/types'
import React from 'react'
import { Text } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import CoinWrap from './CoinWrap'

interface AssetRatioType {
  isHorizontal: boolean
  className?: string
  ratio: Ratio[] | any
}

const AssetRatio: React.FC<AssetRatioType> = ({ isHorizontal = false, className = '', ratio = [] }) => {
  const { t } = useTranslation()

  return (
    <div className={className}>
      <Text
        textStyle="R_12R"
        color="mediumgrey"
        className={!isHorizontal ? 'mb-2' : ''}
        textAlign={isHorizontal ? 'left' : 'center'}
      >
        {t('Asset Ratio')}
      </Text>
      <div className="flex flex-wrap" style={{ marginLeft: isHorizontal ? '-8px' : '' }}>
        {ratio
          .filter((r) => r.value)
          .map((m) => (
            <CoinWrap key={m.symbol} mx="S_4" py="S_8" symbol={m.symbol || ''}
              size="sm" spacing="S_6">
              <Text textStyle="R_14R">{m.value}%</Text>
            </CoinWrap>
          ))}
      </div>
    </div>
  )
}

export default AssetRatio
