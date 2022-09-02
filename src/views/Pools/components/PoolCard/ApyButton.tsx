import React from 'react'
import BigNumber from 'bignumber.js'
import ApyCalculatorModal from './ApyCalculatorModal'
import { IconButton } from 'uikit-dev'
import { useModal } from 'uikitV2/Modal'
import { CalculateIcon } from 'uikitV2/components/Svg'

export interface ApyButtonProps {
  lpLabel?: string
  apy?: BigNumber
  addLiquidityUrl?: string
  coin: string
}

const ApyButton: React.FC<ApyButtonProps> = ({ lpLabel, apy, addLiquidityUrl, coin }) => {
  const [onPresentApyModal, onDismiss] = useModal(
    <ApyCalculatorModal
      lpLabel={lpLabel}
      apy={apy}
      addLiquidityUrl={addLiquidityUrl}
      coin={coin}
      // onDismiss={onDismiss}
    />,
    true,
  )

  return (
    <IconButton size="xs" onClick={onPresentApyModal} variant="text" color="#5e515f">
      <CalculateIcon width={16} />
    </IconButton>
  )
}

export default ApyButton
