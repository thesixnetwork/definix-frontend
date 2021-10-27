import BigNumber from 'bignumber.js'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from 'uikit-dev'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface WithdrawModalProps {
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  renderCardHeading?: (className?: string, inlineMultiplier?: boolean) => JSX.Element
  totalLiquidity: string
  myLiquidity: BigNumber
  myLiquidityUSDPrice: string
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  onDismiss,
  tokenName = '',
  renderCardHeading,
  totalLiquidity,
  myLiquidity,
  myLiquidityUSDPrice,
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => getFullDisplayBalance(myLiquidity), [myLiquidity])

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
      {renderCardHeading('mb-5', true)}

      <p>totalLiquidity: {totalLiquidity}</p>
      <p>myLiquidity: {fullBalance}</p>
      <p>myLiquidityUSDPrice: {myLiquidityUSDPrice}</p>

      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={TranslateString(588, 'Unstake')}
      />

      <Button
        disabled={pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onConfirm(val)
          setPendingTx(false)
          onDismiss()
        }}
        fullWidth
        radii="card"
        className="mt-5"
      >
        {pendingTx ? TranslateString(488, 'Pending') : TranslateString(464, 'Remove LP')}
      </Button>
    </Modal>
  )
}

export default WithdrawModal
