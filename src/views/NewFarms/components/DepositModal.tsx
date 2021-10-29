import BigNumber from 'bignumber.js'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useMemo, useState } from 'react'
import Lottie from 'react-lottie'
import { Button, Modal } from 'uikit-dev'
import loading from 'uikit-dev/animation/farmPool.json'
import { getFullDisplayBalance } from 'utils/formatBalance'

const options = {
  loop: true,
  autoplay: true,
  animationData: loading,
}

interface DepositModalProps {
  tokenName?: string
  tokenBalance: BigNumber
  totalLiquidity: string
  myLiquidity: BigNumber
  myLiquidityUSDPrice: string
  addLiquidityUrl?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  renderCardHeading?: (className?: string, inlineMultiplier?: boolean) => JSX.Element
}

const DepositModal: React.FC<DepositModalProps> = ({
  tokenBalance,
  onConfirm,
  onDismiss,
  tokenName = '',
  addLiquidityUrl,
  renderCardHeading,
  totalLiquidity,
  myLiquidity,
  myLiquidityUSDPrice,
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(tokenBalance)
  }, [tokenBalance])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectBalanceRate = useCallback(
    (rate: number) => {
      const balance = tokenBalance.times(rate / 100);
      setVal(getFullDisplayBalance(balance))
    },
    [tokenBalance, setVal]
  )

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
      {pendingTx ? <Lottie options={options} height={164} width={164} /> : renderCardHeading('mb-5', true)}

      <p>totalLiquidity: {totalLiquidity}</p>
      <p>myLiquidity: {getFullDisplayBalance(myLiquidity)}</p>
      <p>myLiquidityUSDPrice: {myLiquidityUSDPrice}</p>

      <ModalInput
        value={val}
        onSelectBalanceRateButton={handleSelectBalanceRate}
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
        {pendingTx ? TranslateString(488, 'Pending') : TranslateString(464, `Deposit`)}
      </Button>
    </Modal>
  )
}

export default DepositModal
