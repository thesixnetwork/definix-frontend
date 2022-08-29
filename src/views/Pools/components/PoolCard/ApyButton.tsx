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
    <IconButton style={{ height: '24px', width: '24px' }} onClick={onPresentApyModal} variant="text" color="#5e515f">
      <CalculateIcon color="#5e515f" style={{ padding: 0, height: '24px' }} />
    </IconButton>
  )
}

export default ApyButton
