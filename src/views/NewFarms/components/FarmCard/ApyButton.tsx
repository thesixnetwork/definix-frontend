import React from 'react'
import BigNumber from 'bignumber.js'
import { CalculatorIcon, IconButton, useModal } from '@fingerlabs/definixswap-uikit-v2'
import ApyCalculatorModal from './ApyCalculatorModal'

export interface ApyButtonProps {
  lpLabel?: string
  apy?: BigNumber
  addLiquidityUrl?: string
}

const ApyButton: React.FC<ApyButtonProps> = ({ lpLabel, apy, addLiquidityUrl }) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal lpLabel={lpLabel} apy={apy} addLiquidityUrl={addLiquidityUrl} />,
  )

  return (
    <IconButton onClick={onPresentApyModal} p={0} style={{ height: '26px' }}>
      <CalculatorIcon />
    </IconButton>
  )
}

export default ApyButton
