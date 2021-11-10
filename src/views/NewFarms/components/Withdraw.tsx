import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useUnstake from 'hooks/useUnstake'
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
} from 'definixswap-uikit'
import { getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import ModalInput from 'components/ModalInput'
import ConfirmModal from './ConfirmModal'
import CardHeading from './FarmCard/CardHeading'
import { FarmWithStakedValue } from './FarmCard/types'

interface WithdrawProps {
  farm: FarmWithStakedValue
  removed: boolean
  pid: number
  tokenName: string
  tokenBalance: BigNumber
  totalLiquidity: string
  myLiquidity: BigNumber
  myLiquidityUSD: number
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
  myLiquidityUSD,
  farm,
  removed,
  onBack,
}) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])

  const [val, setVal] = useState('')
  const { onUnstake } = useUnstake(pid)

  const fullBalance = useMemo(() => getFullDisplayBalance(myLiquidity), [myLiquidity])
  const myLiquidityValue = useMemo(() => getBalanceNumber(myLiquidity), [myLiquidity])

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
      {/* <p>totalLiquidity: {totalLiquidity}</p>
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
      </Button> */}
      <Box className="mb-s20" style={{ cursor: 'pointer' }} display="inline-flex" onClick={onBack}>
        <Flex>
          <BackIcon />
          <Text textStyle="R_16M" color={ColorStyles.MEDIUMGREY} className="ml-s6">
            Back
          </Text>
        </Flex>
      </Box>

      <TitleSet title="Remove LP" description={t('Remove LPs from the farm.')} />

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
            Remove
          </Button>
        </Box>
      </Card>
    </>
  )
}

export default Withdraw
