import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useStake from 'hooks/useStake'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import { ColorStyles, Text, Box, TitleSet, Card, Flex, Divider, BackIcon, useModal } from 'definixswap-uikit'
import ModalInput from 'components/ModalInput'
import CurrencyText from 'components/CurrencyText'
import ConfirmModal from './ConfirmModal'
import CardHeading from './FarmCard/CardHeading'
import { FarmWithStakedValue } from './FarmCard/types'

const Deposit: React.FC<{
  farm: FarmWithStakedValue
  removed: boolean
  pid: number
  tokenName: string
  tokenBalance: BigNumber
  totalLiquidity: BigNumber
  myLiquidity: BigNumber
  myLiquidityPrice: BigNumber
  addLiquidityUrl: string
  onBack: () => void
}> = ({
  farm,
  removed,
  pid,
  tokenBalance,
  tokenName = '',
  addLiquidityUrl,
  totalLiquidity,
  myLiquidity,
  myLiquidityPrice,
  onBack,
}) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { convertToBalanceFormat, convertToPriceFormat } = useConverter()
  const { onStake } = useStake(pid)
  const [isPendingTX, setIsPendingTX] = useState(false)
  const [val, setVal] = useState('')

  const fullBalance = useMemo(() => getFullDisplayBalance(tokenBalance), [tokenBalance])

  const totalLiquidityValue = useMemo(() => {
    return convertToBalanceFormat(getBalanceNumber(totalLiquidity))
  }, [totalLiquidity, convertToBalanceFormat])

  const myLiquidityValue = useMemo(() => getBalanceNumber(myLiquidity), [myLiquidity])

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
      const balance = tokenBalance.times(rate / 100)
      setVal(getFullDisplayBalance(balance))
    },
    [tokenBalance, setVal],
  )

  const handleStake = useCallback(async () => {
    if (isPendingTX) return
    try {
      setIsPendingTX(true)
      await onStake(val)
      toastSuccess(t('Deposit Complete'))
      onBack()
    } catch (error) {
      toastError(t('Deposit Failed'))
    } finally {
      setIsPendingTX(false)
    }
  }, [onStake, val, onBack, isPendingTX, toastSuccess, toastError, t])

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm Deposit')}
      buttonName="Deposit"
      lpSymbol={tokenName}
      stakedBalance={val}
      onOK={handleStake}
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

      <TitleSet title={t('Deposit LP')} description={t('Deposit LP on the farm')} />

      <CardWrap>
        <CardHeading farm={farm} lpLabel={tokenName} removed={removed} addLiquidityUrl={addLiquidityUrl} />

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
          max={fullBalance}
          symbol={tokenName}
          buttonName={t('Deposit')}
          onSelectBalanceRateButton={handleSelectBalanceRate}
          onChange={handleChange}
          onClickButton={() => onPresentConfirmModal()}
        />
      </CardWrap>
    </>
  )
}

export default Deposit
