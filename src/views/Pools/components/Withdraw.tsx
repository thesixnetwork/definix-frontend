import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useSousUnstake } from 'hooks/useUnstake'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { ColorStyles, Text, Box, TitleSet, Card, Flex, Divider, BackIcon, useModal } from 'definixswap-uikit'
import ModalInput from 'components/ModalInput'
import CurrencyText from 'components/CurrencyText'
import ConfirmModal from './ConfirmModal'
import CardHeading from './PoolCard/CardHeading'
import { PoolWithApy } from './PoolCard/types'

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

const Withdraw: React.FC<{
  isOldSyrup: boolean
  pool: PoolWithApy
  onBack: () => void
}> = ({ isOldSyrup, pool, onBack }) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { convertToPriceFromSymbol, convertToBalanceFormat, convertToPriceFormat } = useConverter()
  const { onUnstake } = useSousUnstake(pool.sousId)
  const [isPendingTX, setIsPendingTX] = useState(false)
  const [val, setVal] = useState('')

  const price = useMemo(() => {
    return convertToPriceFromSymbol(pool.stakingTokenName)
  }, [convertToPriceFromSymbol, pool.stakingTokenName])

  const totalStakedValue = useMemo(() => {
    return convertToBalanceFormat(getBalanceNumber(pool.totalStaked))
  }, [pool.totalStaked, convertToBalanceFormat])

  const myStakedBalance = useMemo(() => new BigNumber(pool.userData?.stakedBalance || 0), [pool.userData])

  const myStakedValue = useMemo(() => {
    return getBalanceNumber(myStakedBalance)
  }, [myStakedBalance])

  const myStakedDisplayValue = useMemo(() => {
    return convertToBalanceFormat(myStakedValue)
  }, [myStakedValue, convertToBalanceFormat])

  const myStakedPrice = useMemo(() => {
    return convertToPriceFormat(new BigNumber(myStakedValue).multipliedBy(price).toNumber())
  }, [convertToPriceFormat, myStakedValue, price])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectBalanceRate = useCallback(
    (rate: number) => {
      if (rate === 100) {
        setVal(numeral(getBalanceNumber(myStakedBalance)).format('0.000000'))
      } else {
        const balance = myStakedBalance.times(rate / 100)
        setVal(numeral(getBalanceNumber(balance)).format('0.00'))
      }
    },
    [myStakedBalance, setVal],
  )

  const handleUnstake = useCallback(async () => {
    if (isPendingTX) return
    try {
      setIsPendingTX(true)
      await onUnstake(isOldSyrup ? '0' : val)
      toastSuccess(t('Remove Complete'))
      onBack()
    } catch (error) {
      toastError(t('Remove Failed'))
    } finally {
      setIsPendingTX(false)
    }
  }, [isOldSyrup, onUnstake, val, isPendingTX, onBack, toastSuccess, toastError, t])

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm Remove')}
      buttonName={t('Remove')}
      tokenName={pool.stakingTokenName}
      stakedBalance={val}
      onOK={handleUnstake}
    />,
    false,
  )

  return (
    <>
      <Box className="mb-s20" style={{ cursor: 'pointer' }} display="inline-flex" onClick={onBack}>
        <Flex>
          <BackIcon />
          <Text textStyle="R_16M" color={ColorStyles.MEDIUMGREY} className="ml-s6">
            {t('Back')}
          </Text>
        </Flex>
      </Box>

      <TitleSet title={t('Remove from the Pool')} description={t('Remove tokens from the pool')} />

      <CardWrap>
        <CardHeading isOldSyrup={isOldSyrup} pool={pool} />

        <CardBody>
          <LiquidityInfo hasMb>
            <LiquidityTitle>{t('Total staked')}</LiquidityTitle>
            <LiquidityValue>
              <BalanceText>{totalStakedValue}</BalanceText>
            </LiquidityValue>
          </LiquidityInfo>

          <LiquidityInfo hasMb={false}>
            <LiquidityTitle>{t('My Staked')}</LiquidityTitle>
            <LiquidityValue>
              <BalanceText>{myStakedDisplayValue}</BalanceText>
              <PriceText value={myStakedPrice} prefix="=" />
            </LiquidityValue>
          </LiquidityInfo>
        </CardBody>

        <StyledDivider />

        <ModalInput
          value={val}
          max={myStakedBalance}
          symbol={pool.stakingTokenName}
          buttonName={t('Remove')}
          onSelectBalanceRateButton={handleSelectBalanceRate}
          onChange={handleChange}
          onClickButton={() => onPresentConfirmModal()}
        />
      </CardWrap>
    </>
  )
}

export default Withdraw
