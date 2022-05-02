import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React, { useState, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { QuoteToken } from 'config/constants/types'
import { useHarvest } from 'hooks/useHarvest'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { Button, Text, ButtonVariants, Flex, Box, Label, ColorStyles } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'

const HarvestAction: React.FC<{
  componentType: string
  pid?: number
  allEarnings: {
    symbol: QuoteToken
    earnings: number
  }[]
  lpSymbol: string
}> = ({ pid, allEarnings, componentType = 'farm', lpSymbol }) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const navigate = useHistory()
  const isInFarm = useMemo(() => componentType === 'farm', [componentType])
  const [pendingTx, setPendingTx] = useState(false)

  const { onReward } = useHarvest(pid)
  const { convertToPriceFromSymbol, convertToBalanceFormat } = useConverter()

  const getPrice = useCallback((value, unitPrice) => {
    return new BigNumber(value).multipliedBy(unitPrice).toNumber()
  }, [])

  const showHarvestResult = useCallback(
    (isSuccess: boolean) => {
      const toastDescription = (
        <Text textStyle="R_12R" color={ColorStyles.MEDIUMGREY}>
          {lpSymbol}
        </Text>
      )
      const actionText = t('actionHarvest')
      if (isSuccess) {
        toastSuccess(t('{{Action}} Complete', { Action: actionText }), toastDescription)
      } else {
        toastError(t('{{Action}} Failed', { Action: actionText }), toastDescription)
      }
    },
    [toastSuccess, toastError, t, lpSymbol],
  )

  const handleHarvest = useCallback(async () => {
    try {
      if (pendingTx) return
      setPendingTx(true)
      await onReward()
      showHarvestResult(true)
    } catch {
      showHarvestResult(false)
    } finally {
      setPendingTx(false)
    }
  }, [onReward, showHarvestResult, pendingTx])

  const renderHarvestButton = useMemo(
    () => (
      <Button
        variant={ButtonVariants.RED}
        width="100%"
        disabled={allEarnings.reduce((sum, { earnings }) => sum + earnings, 0) === 0}
        isLoading={pendingTx}
        onClick={handleHarvest}
      >
        {t('Harvest')}
      </Button>
    ),
    [t, allEarnings, pendingTx, handleHarvest],
  )

  const renderDetailButton = useMemo(
    () => (
      <DetailButton variant={ButtonVariants.BROWN} width="100%" onClick={() => navigate.push('/farm')}>
        {t('Detail')}
      </DetailButton>
    ),
    [navigate, t],
  )

  const renderEarnedPrice = useCallback((tokenName, balance, price) => {
    return <Flex key={tokenName} mb="8px">
      <TokenLabel type="token">{tokenName}</TokenLabel>
      <TokenValueWrap>
        <BalanceText>{convertToBalanceFormat(balance)}</BalanceText>
        <PriceText value={price} prefix="=" />
      </TokenValueWrap>
    </Flex>
  }, [convertToBalanceFormat])

  return (
    <>
      <Box>
        <Wrap isInFarm={isInFarm}>
          <Box>
            <TitleSection>{t('Earned Token')}</TitleSection>
            <HarvestInfo>
              <Flex flexDirection="column">
                {
                  allEarnings.length > 0 && allEarnings.map((item) => renderEarnedPrice(item.symbol, item.earnings, getPrice(item.earnings, convertToPriceFromSymbol(item.symbol))))
                }
              </Flex>
              {isInFarm && <HarvestButtonSectionInFarm>{renderHarvestButton}</HarvestButtonSectionInFarm>}
            </HarvestInfo>
          </Box>

          {isInFarm ? null : (
            <HarvestButtonSectionInMyInvestment>
              {renderHarvestButton}
              {renderDetailButton}
            </HarvestButtonSectionInMyInvestment>
          )}
        </Wrap>
      </Box>
    </>
  )
}

export default React.memo(HarvestAction)

const Wrap = styled(Flex)<{ isInFarm: boolean }>`
  flex-direction: ${({ isInFarm }) => (isInFarm ? 'column' : 'row')};
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
  }
`
const TitleSection = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.S_8}px;
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_12R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-bottom: ${({ theme }) => theme.spacing.S_6}px;
  }
`
const HarvestInfo = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
  }
`
const TokenLabel = styled(Label)`
  margin-right: ${({ theme }) => theme.spacing.S_6}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-right: ${({ theme }) => theme.spacing.S_12}px;
  }
`
const TokenValueWrap = styled(Box)`
  margin-top: -3px;
`
const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }
`
const PriceText = styled(CurrencyText)`
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_14R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
`
const HarvestButtonSectionInFarm = styled(Box)`
  width: 100px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: ${({ theme }) => theme.spacing.S_20}px;
    width: 100%;
  }
`
const HarvestButtonSectionInMyInvestment = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  width: 100px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: row;
    margin-top: ${({ theme }) => theme.spacing.S_28}px;
    width: 100%;
  }
`
const DetailButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.S_8}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 0;
    margin-left: ${({ theme }) => theme.spacing.S_16}px;
  }
`