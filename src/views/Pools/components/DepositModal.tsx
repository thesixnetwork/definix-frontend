import BigNumber from 'bignumber.js'
import ModalInput from 'components/ModalInput'
import React, { useCallback, useMemo, useState } from 'react'
import Lottie from 'react-lottie'
import { Button, Modal } from 'uikit-dev'
import loading from 'uikit-dev/animation/farmPool.json'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useI18n from '../../../hooks/useI18n'

const options = {
  loop: true,
  autoplay: true,
  animationData: loading,
}

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  renderCardHeading?: (className?: string) => JSX.Element
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = '',
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
      bodyPadding="0 32px 32px 32px"
      hideCloseButton
      classHeader="bd-b-n"
    >
      {pendingTx ? <Lottie options={options} height={164} width={164} /> : renderCardHeading('mb-5')}

      <ModalInput
        value={val}
        onSelectBalanceRateButton={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        // inputTitle={TranslateString(1070, 'Stake')}
      />

      <Button
        fullWidth
        className="mt-5"
        radii="card"
        disabled={pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onConfirm(val)
          setPendingTx(false)
          onDismiss()
        }}
      >
        {pendingTx ? TranslateString(488, 'Pending') : TranslateString(464, `Deposit ${tokenName}`)}
      </Button>
    </Modal>
  )
}

export default DepositModal
