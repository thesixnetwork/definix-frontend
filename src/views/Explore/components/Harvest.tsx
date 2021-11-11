/* eslint-disable no-nested-ternary */
import React from 'react'
import { Button } from 'uikit-dev'
import finix from 'uikit-dev/images/finix-coin.png'
import TwoLineFormat from './TwoLineFormat'

interface HarvestType {
  value?: string
  subValue?: string
  isVertical?: boolean
  large?: boolean
}

const Harvest: React.FC<HarvestType> = ({ value, subValue, isVertical = false, large = false }) => {
  return (
    <div className={isVertical ? '' : `flex align-center ${large ? 'mb-3' : 'mb-2'}`}>
      <TwoLineFormat
        className={isVertical ? 'pa-3' : large ? 'col-6' : 'col-7'}
        title="FINIX Earned"
        value={value}
        subValue={`= ${subValue}`}
        coin={finix}
        large={large}
      />

      <div className={isVertical ? 'pa-3 bd-t' : large ? 'col-6 pl-2' : 'col-5 pl-2'}>
        <Button fullWidth radii="small" variant="success">
          Harvest
        </Button>
      </div>
    </div>
  )
}

export default Harvest
