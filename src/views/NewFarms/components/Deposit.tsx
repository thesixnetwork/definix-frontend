import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
// import Lottie from 'react-lottie'
import { Button } from 'uikit-dev'
import useModal from 'uikit-dev/widgets/Modal/useModal'
// import loading from 'uikit-dev/animation/farmPool.json'
import { getFullDisplayBalance } from 'utils/formatBalance'
import ModalInput from 'components/ModalInput'
import ConfirmModal from './ConfirmModal'

// const options = {
//   loop: true,
//   autoplay: true,
//   animationData: loading,
// }

interface DepositProps {
  pid: number
  tokenName: string
  tokenBalance: BigNumber
  totalLiquidity: string
  myLiquidity: BigNumber
  myLiquidityUSDPrice: string
  addLiquidityUrl: string
  onBack: () => void
}

const Deposit: React.FC<DepositProps> = ({
  pid,
  tokenBalance,
  tokenName = '',
  addLiquidityUrl,
  totalLiquidity,
  myLiquidity,
  myLiquidityUSDPrice,
  onBack,
}) => {
  console.groupCollapsed('Deposit data: ')
  console.log('tokenBalance: ', tokenBalance)
  console.log('tokenName: ', tokenName)
  console.log('addLiquidityUrl: ', addLiquidityUrl)
  console.log('totalLiquidity: ', totalLiquidity)
  console.log('myLiquidity: ', myLiquidity)
  console.log('myLiquidityUSDPrice: ', myLiquidityUSDPrice)
  console.groupEnd()
  const [val, setVal] = useState('')
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
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
      const balance = tokenBalance.times(rate / 100)
      setVal(getFullDisplayBalance(balance))
    },
    [tokenBalance, setVal],
  )

  /**
   * confirm modal
   */
  const [ onPresentConfirmModal ] = useModal((
    <ConfirmModal
      type="deposit"
      tokenName={tokenName}
      stakedBalance={val}
      onOK={() => onStake(val)}
    />
  ), false)

  return (
    <>
      <Button
        onClick={onBack}
        fullWidth
        className="mt-5"
        radii="card"
      >
        Back
      </Button>

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
        onClick={() => onPresentConfirmModal()}
        fullWidth
        className="mt-5"
        radii="card"
      >
        Deposit
      </Button>
    </>
    // <Modal
    //   title=""
    //   onBack={onDismiss}
    //   onDismiss={onDismiss}
    //   isRainbow={false}
    //   bodyPadding="0 32px 32px 32px"
    //   hideCloseButton
    //   classHeader="bd-b-n"
    // >
    //   {/* {pendingTx ? <Lottie options={options} height={164} width={164} /> : renderCardHeading('mb-5', true)} */}

      

    //   <ModalInput
    //     value={val}
    //     onSelectBalanceRateButton={handleSelectBalanceRate}
    //     onChange={handleChange}
    //     max={fullBalance}
    //     symbol={tokenName}
    //     addLiquidityUrl={addLiquidityUrl}
    //     inputTitle={TranslateString(1070, 'Stake')}
    //   />

    //   <Button
    //     onClick={() => onConfirm(val)}
    //     fullWidth
    //     className="mt-5"
    //     radii="card"
    //   >
    //     Deposit
    //   </Button>
    // </Modal>
  )
}

export default Deposit
