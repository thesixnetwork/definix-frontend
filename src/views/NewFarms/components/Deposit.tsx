import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useStake from 'hooks/useStake'
// import Lottie from 'react-lottie'
// import { Button } from 'uikit-dev'
// import useModal from 'uikit-dev/widgets/Modal/useModal'
// import loading from 'uikit-dev/animation/farmPool.json'
import { getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import {
  ColorStyles,
  Text,
  Box,
  TitleSet,
  Card,
  Flex,
  Divider,
  Button,
  ButtonVariants,
  BackIcon,
  useModal,
  useMatchBreakpoints,
  ToastContainer,
  alertVariants,
} from 'definixswap-uikit'
import ModalInput from 'components/ModalInput'
import ConfirmModal from './ConfirmModal'
import CardHeading from './FarmCard/CardHeading'
import { FarmWithStakedValue } from './FarmCard/types'

interface DepositProps {
  farm: FarmWithStakedValue
  removed: boolean
  pid: number
  tokenName: string
  tokenBalance: BigNumber
  totalLiquidity: BigNumber
  myLiquidity: BigNumber
  myLiquidityUSD: number
  addLiquidityUrl: string
  onBack: () => void
}

const Deposit: React.FC<DepositProps> = ({
  farm,
  removed,
  pid,
  tokenBalance,
  tokenName = '',
  addLiquidityUrl,
  totalLiquidity,
  myLiquidity,
  myLiquidityUSD,
  onBack,
}) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const { onStake } = useStake(pid)
  const [isPendingTX, setIsPendingTX] = useState(false)
  const [val, setVal] = useState('')
  const [toasts, setToasts] = useState([])

  const fullBalance = useMemo(() => getFullDisplayBalance(tokenBalance), [tokenBalance])
  const myLiquidityValue = useMemo(() => getBalanceNumber(myLiquidity), [myLiquidity])

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

  const showToast = useCallback((type: string, title: string) => {
    setToasts((prevToasts) => [
      {
        id: 'harvest_result',
        title,
        type,
      },
      ...prevToasts,
    ])
  }, [])

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id))
  }

  const handleStake = useCallback(async () => {
    if (isPendingTX) return
    try {
      setIsPendingTX(true)
      await onStake(val)
      showToast(alertVariants.SUCCESS, t('Deposit Complete'))
      onBack()
    } catch (error) {
      showToast(alertVariants.DANGER, t('Remove Complete'))
    } finally {
      setIsPendingTX(false)
    }
  }, [onStake, val, onBack, isPendingTX, showToast, t])

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal title={t('Confirm Deposit')} buttonName="Deposit" lpSymbol={tokenName} stakedBalance={val} onOK={handleStake} />,
    false,
  )

  const cardStyle = useMemo((): {
    flexDirection: 'column' | 'row'
    margin: string
    padding: string
  } => {
    return {
      flexDirection: isMobile ? 'column' : 'row',
      margin: `my-s${isMobile ? '28' : '40'}`,
      padding: `pa-s${isMobile ? '20' : '40'}`,
    }
  }, [isMobile])

  const columnStyle = useMemo((): {
    flexDirection: 'column' | 'row'
    width: string
    justifyContent: 'space-between' | 'normal'
    valueTextSize: string
    valueTextWidth: string
  } => {
    return {
      flexDirection: isMobile ? 'row' : 'column',
      width: isMobile ? '100%' : '50%',
      justifyContent: isMobile ? 'space-between' : 'normal',
      valueTextSize: isMobile ? 'R_16M' : 'R_18M',
      valueTextWidth: isMobile ? '65%' : '100%',
    }
  }, [isMobile])

  return (
    <>
      <Box className="mb-s20" style={{ cursor: 'pointer' }} display="inline-flex" onClick={onBack}>
        <Flex>
          <BackIcon />
          <Text textStyle="R_16M" color={ColorStyles.MEDIUMGREY} className="ml-s6">
            Back
          </Text>
        </Flex>
      </Box>

      <TitleSet title={t('Deposit LP')} description={t('Deposit LP on the farm')} />

      <Card className={`${cardStyle.margin} ${cardStyle.padding}`}>
        <CardHeading farm={farm} lpLabel={tokenName} removed={removed} addLiquidityUrl={addLiquidityUrl} />

        <Flex justifyContent="space-between" flexDirection={cardStyle.flexDirection} className="mt-s20">
          <Flex
            flexDirection={columnStyle.flexDirection}
            justifyContent={columnStyle.justifyContent}
            style={{ width: columnStyle.width }}
          >
            <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
              {t('Total staked')}
            </Text>
            <Text width={columnStyle.valueTextWidth} color={ColorStyles.BLACK} textStyle={columnStyle.valueTextSize}>
              {totalLiquidity}
            </Text>
          </Flex>

          <Flex
            flexDirection={columnStyle.flexDirection}
            justifyContent={columnStyle.justifyContent}
            style={{ width: columnStyle.width }}
          >
            <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
              {t('My Staked')}
            </Text>
            <Box width={columnStyle.valueTextWidth}>
              <Text textStyle={columnStyle.valueTextSize} color={ColorStyles.BLACK}>
                {myLiquidityValue.toFixed(6)}
              </Text>
              <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
                = {myLiquidityUSD}
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Divider className="mt-s20 mb-s28" />

        <ModalInput
          value={val}
          onSelectBalanceRateButton={handleSelectBalanceRate}
          onChange={handleChange}
          max={fullBalance}
          symbol={tokenName}
          // addLiquidityUrl={addLiquidityUrl}
          inputTitle="stake"
        />
        <Box className="mt-s40">
          <Button
            variant={ButtonVariants.RED}
            lg
            onClick={() => onPresentConfirmModal()}
            width="100%"
            disabled={!val || val === '0'}
          >
            Deposit
          </Button>
        </Box>
      </Card>
      <ToastContainer toasts={toasts} onRemove={hideToast} />
      {/* 
      <p>totalLiquidity: {totalLiquidity}</p>
      <p>myLiquidity: {getFullDisplayBalance(myLiquidity)}</p>
      <p>myLiquidityUSDPrice: {myLiquidityUSDPrice}</p> */}
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
