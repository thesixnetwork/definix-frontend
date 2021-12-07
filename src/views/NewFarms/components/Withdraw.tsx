import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import useUnstake from 'hooks/useUnstake'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { ColorStyles, Text, Box, TitleSet, Card, Flex, Divider, BackIcon, useModal } from 'definixswap-uikit'
import ModalInput from 'components/ModalInput'
import CurrencyText from 'components/CurrencyText'
import ConfirmModal from './ConfirmModal'
import CardHeading from './FarmCard/CardHeading'
import { FarmWithStakedValue } from './FarmCard/types'

const Withdraw: React.FC<{
  farm: FarmWithStakedValue
  removed: boolean
  pid: number
  lpTokenName: string
  totalLiquidity: BigNumber
  myLiquidity: BigNumber
  myLiquidityPrice: BigNumber
  onBack: () => void
}> = ({ pid, lpTokenName = '', totalLiquidity, myLiquidity, myLiquidityPrice, farm, removed, onBack }) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { convertToBalanceFormat } = useConverter()
  const { onUnstake } = useUnstake(pid)
  const [isPendingTX, setIsPendingTX] = useState(false)
  const [val, setVal] = useState('')

  const totalLiquidityValue = useMemo(() => {
    return convertToBalanceFormat(getBalanceNumber(totalLiquidity))
  }, [totalLiquidity, convertToBalanceFormat])

  const myLiquidityValue = useMemo(() => {
    return getBalanceNumber(myLiquidity)
  }, [myLiquidity])

  const myLiquidityDisplayValue = useMemo(() => {
    return convertToBalanceFormat(myLiquidityValue)
  }, [myLiquidityValue, convertToBalanceFormat])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectBalanceRate = useCallback(
    (rate: number) => {
      if (rate === 100) {
        setVal(numeral(getBalanceNumber(myLiquidity)).format('0.000000'))
      } else {
        const balance = myLiquidity.times(rate / 100)
        setVal(numeral(getBalanceNumber(balance)).format('0.00'))
      }
    },
    [myLiquidity, setVal],
  )

  const handleUnstake = useCallback(async () => {
    if (isPendingTX) return
    try {
      setIsPendingTX(true)
      await onUnstake(val)
      toastSuccess(t('Remove Complete'))
      onBack()
    } catch (error) {
      toastError(t('Remove Failed'))
    } finally {
      setIsPendingTX(false)
    }
  }, [onUnstake, val, isPendingTX, onBack, toastSuccess, toastError, t])

  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm Remove')}
      buttonName={t('Remove')}
      lpSymbol={lpTokenName}
      stakedBalance={val}
      onOK={handleUnstake}
    />,
    false,
  )

  const CardWrap = styled(Card)`
    margin-top: ${({ theme }) => theme.spacing.S_40}px;
    padding: ${({ theme }) => theme.spacing.S_40}px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-top: ${({ theme }) => theme.spacing.S_28}px;
      padding: ${({ theme }) => theme.spacing.S_20}px;
    }
  `
  const CardBody = styled(Flex)`
    justify-content: space-between;
    flex-direction: row;
    margin-top: ${({ theme }) => theme.spacing.S_20}px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: column;
    }
  `
  const LiquidityInfo = styled(Flex)<{ hasMb: boolean }>`
    flex-direction: column;
    justify-content: normal;
    width: 50%;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-bottom: ${({ theme, hasMb }) => (hasMb ? theme.spacing.S_16 : 0)}px;
      width: 100%;
    }
  `
  const LiquidityTitle = styled(Text)`
    margin-bottom: ${({ theme }) => theme.spacing.S_4}px;
    color: ${({ theme }) => theme.colors.mediumgrey};
    ${({ theme }) => theme.textStyle.R_12R};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-bottom: 0;
    }
  `
  const LiquidityValue = styled(Text)`
    width: 100%;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      width: 65%;
    }
  `
  const BalanceText = styled(Text)`
    color: ${({ theme }) => theme.colors.black};
    ${({ theme }) => theme.textStyle.R_18M};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_16M};
    }
  `
  const PriceText = styled(CurrencyText)`
    color: ${({ theme }) => theme.colors.deepgrey};
    ${({ theme }) => theme.textStyle.R_14R};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_12R};
    }
  `
  const StyledDivider = styled(Divider)`
    margin-top: ${({ theme }) => theme.spacing.S_20}px;
    margin-bottom: ${({ theme }) => theme.spacing.S_28}px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin: ${({ theme }) => theme.spacing.S_24}px 0;
    }
  `

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

      <TitleSet title="Remove LP" description={t('Remove LPs from the farm.')} />

      <CardWrap>
        <CardHeading
          // apy={farm.apy}
          // lpSymbols={farm.lpSymbols}
          farm={farm}
          lpLabel={lpTokenName}
          removed={removed}
        />

        <CardBody>
          <LiquidityInfo hasMb>
            <LiquidityTitle>{t('Total staked')}</LiquidityTitle>
            <LiquidityValue>
              <BalanceText>{totalLiquidityValue}</BalanceText>
            </LiquidityValue>
          </LiquidityInfo>

          <LiquidityInfo hasMb={false}>
            <LiquidityTitle>{t('My Staked')}</LiquidityTitle>
            <LiquidityValue>
              <BalanceText>{myLiquidityDisplayValue}</BalanceText>
              <PriceText value={myLiquidityPrice.toNumber()} prefix="=" />
            </LiquidityValue>
          </LiquidityInfo>
        </CardBody>

        <StyledDivider />

        <ModalInput
          value={val}
          onSelectBalanceRateButton={handleSelectBalanceRate}
          onChange={handleChange}
          max={myLiquidity}
          symbol={lpTokenName}
          buttonName={t('Remove')}
          onClickButton={() => onPresentConfirmModal()}
        />
      </CardWrap>
    </>
  )
}

export default Withdraw
