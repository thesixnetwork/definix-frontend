import { Ratio } from 'config/constants/types'
import React from 'react'
import { Text } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import Coin from './Coin'

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
            <Coin mx="S_4" py="S_8" isHorizontal={isHorizontal} symbol={m.symbol || ''}>
              <Text textStyle="R_14R">{m.value}%</Text>
            </Coin>
          ))}
      </div>
    </div>
  )
}

export default AssetRatio
