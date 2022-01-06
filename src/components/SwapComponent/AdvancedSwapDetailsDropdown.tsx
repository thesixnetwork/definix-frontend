import React from 'react'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

export default function AdvancedSwapDetailsDropdown({ trade, isPriceImpactCaution, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)
  return (
    <AdvancedSwapDetails
      {...rest}
      trade={trade ?? lastTrade ?? undefined}
      isPriceImpactCaution={isPriceImpactCaution}
    />
  )
}
