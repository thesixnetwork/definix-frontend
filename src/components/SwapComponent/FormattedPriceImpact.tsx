import { useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { Percent } from 'definixswap-sdk'
import React, { useMemo } from 'react'
import { ONE_BIPS } from '../../constants'
import { warningSeverity } from '../../utils/prices'
import { ErrorText } from './styleds'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])
  return (
    <ErrorText 
      fontSize="14px"
      fontWeight="500"
      severity={warningSeverity(priceImpact)}
      textAlign={isMobile ? "left" : "right"}
    >
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '< 0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </ErrorText>
  )
}
