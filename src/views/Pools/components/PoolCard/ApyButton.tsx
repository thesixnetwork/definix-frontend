import React from 'react'
import BigNumber from 'bignumber.js'
import { CalculateIcon, IconButton, useModal } from 'uikit-dev'
import ApyCalculatorModal from './ApyCalculatorModal'

export interface ApyButtonProps {
  lpLabel?: string
  finixPrice?: BigNumber
  apy?: BigNumber
  addLiquidityUrl?: string
}

const ApyButton: React.FC<ApyButtonProps> = ({ lpLabel, finixPrice, apy, addLiquidityUrl }) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal lpLabel={lpLabel} finixPrice={finixPrice} apy={apy} addLiquidityUrl={addLiquidityUrl} />,
  )

  return (
    <IconButton onClick={onPresentApyModal} size="sm" variant="text" color="primary" className="ml-1">
      <CalculateIcon color="primary" />
    </IconButton>
  )
}

export default ApyButton
