/* eslint-disable no-nested-ternary */
import { Button } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useRebalanceHarvest } from 'hooks/useHarvest'
import numeral from 'numeral'
import React, { useState } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import finix from 'uikit-dev/images/finix-coin.png'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'
import { Rebalance } from '../../../state/types'

interface HarvestType {
  value?: BigNumber
  subValue?: string
  isVertical?: boolean
  large?: boolean
  rebalance: Rebalance | any
  className?: string
}

const Harvest: React.FC<HarvestType> = ({ value, isVertical = false, large = false, rebalance, className = '' }) => {
  const [pendingTx, setPendingTx] = useState(false)
  const finixPriceUsd = usePriceFinixUsd()
  const { onReward } = useRebalanceHarvest(rebalance.apollo)

  return (
    <div className={isVertical ? '' : `flex align-center ${large ? 'mb-3' : 'mb-2'} ${className}`}>
      <TwoLineFormatV2
        className={isVertical ? 'pa-3' : large ? 'col-6' : 'col-7'}
        title="FINIX Earned"
        value={`${numeral(value).format('0,0.[000]')}`}
        subValue={`= $${numeral(value.times(finixPriceUsd)).format('0,0.[00]')}`}
        icon={finix}
      />

      <div className={isVertical ? 'pa-3 bd-t' : large ? 'col-6 pl-2' : 'col-5 pl-2'}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          sx={{ height: '48px' }}
          disabled={value.toNumber() === 0 || pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          Harvest
        </Button>
      </div>
    </div>
  )
}

export default Harvest
