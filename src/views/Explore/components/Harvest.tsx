/* eslint-disable no-nested-ternary */
import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import numeral from 'numeral'
import { Button } from 'uikit-dev'
import { usePriceFinixUsd } from 'state/hooks'
import { useRebalanceHarvest } from 'hooks/useHarvest'
import finix from 'uikit-dev/images/finix-coin.png'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'

interface HarvestType {
  value?: BigNumber
  subValue?: string
  isVertical?: boolean
  large?: boolean
  rebalance: Rebalance | any
}

const Harvest: React.FC<HarvestType> = ({ value, isVertical = false, large = false, rebalance }) => {
  const [pendingTx, setPendingTx] = useState(false)
  const finixPriceUsd = usePriceFinixUsd()
  const { onReward } = useRebalanceHarvest(rebalance.apollo)

  return (
    <div className={isVertical ? '' : `flex align-center ${large ? 'mb-3' : 'mb-2'}`}>
      <TwoLineFormat
        className={isVertical ? 'pa-3' : large ? 'col-6' : 'col-7'}
        title="FINIX Earned"
        value={`${numeral(value).format('0,0.[000]')}`}
        subValue={`= $${numeral(value.times(finixPriceUsd)).format('0,0.[00]')}`}
        coin={finix}
        large={large}
      />

      <div className={isVertical ? 'pa-3 bd-t' : large ? 'col-6 pl-2' : 'col-5 pl-2'}>
        <Button fullWidth radii="small" variant="success" 
        disabled={value.toNumber() === 0 || pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onReward()
          setPendingTx(false)
        }}>
          Harvest
        </Button>
      </div>
    </div>
  )
}

export default Harvest
