import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React, { useState, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { QuoteToken } from 'config/constants/types'
import { useHarvest } from 'hooks/useLongTermStake'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { Button, Text, ButtonVariants, Flex, Box, Label } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/CurrencyText'
import BalanceText from 'components/BalanceText'

const Wrap = styled(Flex)`
  flex-direction: row;
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
const FinixEarnText = styled(BalanceText)`
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
const HarvestButtonSection = styled(Flex)`
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

const HarvestAction: React.FC<{
  title: string
  earnings: number
  hasReward: boolean
}> = ({ title, earnings, hasReward }) => {
  const { t } = useTranslation()
  const navigate = useHistory()
  const { toastSuccess, toastError } = useToast()
  const { convertToPriceFromSymbol, convertToPriceFormat } = useConverter()
  const { handleHarvest } = useHarvest()
  const [isLoadingHarvest, setIsLoadingHarvest] = useState(false)

  const earningsPrice = useMemo(() => {
    const price = convertToPriceFromSymbol(QuoteToken.FINIX)
    return convertToPriceFormat(new BigNumber(earnings).multipliedBy(price).toNumber())
  }, [earnings, convertToPriceFromSymbol, convertToPriceFormat])

  const handleGoToDetail = useCallback(() => navigate.push('/long-term-stake'), [navigate])

  const harvest = useCallback(async () => {
    try {
      setIsLoadingHarvest(true)
      await handleHarvest()
      toastSuccess(t('{{Action}} Complete', { Action: t('Harvest') }))
    } catch (e) {
      toastError(t('{{Action}} Failed', { Action: t('Harvest') }))
    } finally {
      setIsLoadingHarvest(false)
    }
  }, [handleHarvest, toastSuccess, toastError, t])

  const renderAirDrop = useCallback(
    () => (
      <Flex>
        <TokenLabel type="token">{QuoteToken.FINIX}</TokenLabel>
        <TokenValueWrap>
          <FinixEarnText value={earnings} />
          <PriceText value={earningsPrice} prefix="=" />
        </TokenValueWrap>
      </Flex>
    ),
    [earnings, earningsPrice],
  )

  const renderHarvestButton = useCallback(
    () => (
      <Button
        variant={ButtonVariants.RED}
        width="100%"
        disabled={!hasReward}
        isLoading={isLoadingHarvest}
        onClick={harvest}
      >
        {t('Harvest')}
      </Button>
    ),
    [t, hasReward, isLoadingHarvest, harvest],
  )

  const renderDetailButton = useCallback(
    () => (
      <DetailButton variant={ButtonVariants.BROWN} width="100%" onClick={handleGoToDetail}>
        {t('Detail')}
      </DetailButton>
    ),
    [t, handleGoToDetail],
  )

  return (
    <>
      <Box>
        <Wrap>
          <Box>
            <TitleSection>{title}</TitleSection>
            <HarvestInfo>
              <Box>{renderAirDrop()}</Box>
            </HarvestInfo>
          </Box>
          <HarvestButtonSection>
            {renderHarvestButton()}
            {renderDetailButton()}
          </HarvestButtonSection>
        </Wrap>
      </Box>
    </>
  )
}

export default HarvestAction
