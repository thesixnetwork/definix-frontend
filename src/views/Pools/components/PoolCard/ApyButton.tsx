import React from 'react'
import BigNumber from 'bignumber.js'
import { CalculatorIcon, IconButton, useModal } from 'definixswap-uikit'
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
    <IconButton onClick={onPresentApyModal} size="sm" variant="text" className="ml-1">
      <CalculatorIcon />
    </IconButton>
  )
}

export default ApyButton
