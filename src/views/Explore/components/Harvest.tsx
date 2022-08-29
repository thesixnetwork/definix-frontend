/* eslint-disable no-nested-ternary */
import { Button, Box } from '@mui/material'
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
    <Box display="flex" justifyContent="space-between" alignItems="center" className={className}>
      <TwoLineFormatV2
        title="FINIX Earned"
        value={`${numeral(value).format('0,0.[000]')}`}
        subValue={`= $${numeral(value.times(finixPriceUsd)).format('0,0.[00]')}`}
        icon={finix}
        large={large}
      />

      <Button
        size={large ? 'large' : 'medium'}
        variant="contained"
        disabled={value.toNumber() === 0 || pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onReward()
          setPendingTx(false)
        }}
        sx={{ width: { xs: '100px', sm: '120px' } }}
      >
        Harvest
      </Button>
    </Box>
  )
}

export default Harvest
