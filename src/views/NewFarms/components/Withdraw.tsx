import BigNumber from 'bignumber.js'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import useUnstake from 'hooks/useUnstake'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from 'uikit-dev'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import ConfirmModal from './ConfirmModal'

interface WithdrawProps {
  pid: number
  tokenName: string
  tokenBalance: BigNumber
  totalLiquidity: string
  myLiquidity: BigNumber
  myLiquidityUSDPrice: string
  addLiquidityUrl: string
  onBack: () => void
}

const Withdraw: React.FC<WithdrawProps> = ({
  pid,
  tokenBalance,
  tokenName = '',
  addLiquidityUrl,
  totalLiquidity,
  myLiquidity,
  myLiquidityUSDPrice,
  onBack,
}) => {
  console.groupCollapsed('Remove data: ')
  console.log('tokenBalance: ', tokenBalance)
  console.log('tokenName: ', tokenName)
  console.log('addLiquidityUrl: ', addLiquidityUrl)
  console.log('totalLiquidity: ', totalLiquidity)
  console.log('myLiquidity: ', myLiquidity)
  console.log('myLiquidityUSDPrice: ', myLiquidityUSDPrice)
  console.groupEnd()
  const [val, setVal] = useState('')
  const TranslateString = useI18n()
  const { onUnstake } = useUnstake(pid)
  const fullBalance = useMemo(() => getFullDisplayBalance(myLiquidity), [myLiquidity])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectBalanceRate = useCallback(
    (rate: number) => {
      const balance = myLiquidity.times(rate / 100)
      setVal(getFullDisplayBalance(balance))
    },
    [myLiquidity, setVal],
  )

  const [onPresentConfirmModal] = useModal(
    <ConfirmModal type="remove" tokenName={tokenName} stakedBalance={val} onOK={() => onUnstake(val)} />,
    false,
  )

  return (
    <>
      <p>totalLiquidity: {totalLiquidity}</p>
      <p>myLiquidity: {fullBalance}</p>
      <p>myLiquidityUSDPrice: {myLiquidityUSDPrice}</p>

      <ModalInput
        onSelectBalanceRateButton={handleSelectBalanceRate}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={TranslateString(588, 'Unstake')}
      />

      <Button onClick={() => onPresentConfirmModal()} fullWidth radii="card" className="mt-5">
        Remove LP
      </Button>
    </>
  )
}

export default Withdraw
