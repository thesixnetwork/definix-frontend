import BigNumber from 'bignumber.js'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from 'uikit-dev'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  addLiquidityUrl?: string
  renderCardHeading?: (className?: string, inlineMultiplier?: boolean) => JSX.Element
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = '',
  addLiquidityUrl,
  renderCardHeading,
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal
      title=""
      onBack={onDismiss}
      onDismiss={onDismiss}
      isRainbow={false}
      bodyPadding="16px 32px 32px 32px"
      hideCloseButton
    >
      {renderCardHeading('mb-5', true)}

      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={TranslateString(1070, 'Stake')}
      />

      <Button
        disabled={pendingTx || fullBalance === '0' || val === '0'}
        onClick={async () => {
          setPendingTx(true)
          await onConfirm(val)
          setPendingTx(false)
          onDismiss()
        }}
        fullWidth
        className="mt-5"
        radii="card"
      >
        {pendingTx ? TranslateString(488, 'Pending') : TranslateString(464, `Deposit ${tokenName}`)}
      </Button>
    </Modal>
  )
}

export default DepositModal
