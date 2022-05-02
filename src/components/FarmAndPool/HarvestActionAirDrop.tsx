import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React, { useState, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { QuoteToken } from 'config/constants/types'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { Button, Text, ButtonVariants, Flex, Box, Label, ColorStyles } from '@fingerlabs/definixswap-uikit-v2'
import { PriceText, StyledBalanceText, TitleSection } from './Styled'

const HarvestAction: React.FC<{
  componentType: string
  allEarnings: {
    symbol: QuoteToken
    earnings: number
  }[]
  tokenName: string

  isEnableHarvest: boolean
  onReward: () => Promise<any>

}> = ({ allEarnings, componentType = 'farm', tokenName, isEnableHarvest, onReward }) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const navigate = useHistory()
  const isInFarmAndPool = useMemo(() => ['farm', 'pool'].includes(componentType), [componentType])
  const [pendingTx, setPendingTx] = useState(false)

  const { convertToPriceFromSymbol } = useConverter()

  const getPrice = useCallback((value, unitPrice) => {
    return new BigNumber(value).multipliedBy(unitPrice).toNumber()
  }, [])

  const showHarvestResult = useCallback(
    (isSuccess: boolean) => {
      const toastDescription = (
        <Text textStyle="R_12R" color={ColorStyles.MEDIUMGREY}>
          {tokenName}
        </Text>
      )
      const actionText = t('actionHarvest')
      if (isSuccess) {
        toastSuccess(t('{{Action}} Complete', { Action: actionText }), toastDescription)
      } else {
        toastError(t('{{Action}} Failed', { Action: actionText }), toastDescription)
      }
    },
    [toastSuccess, toastError, t, tokenName],
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
        disabled={isEnableHarvest}
        isLoading={pendingTx}
        onClick={handleHarvest}
      >
        {t('Harvest')}
      </Button>
    ),
    [t, isEnableHarvest, pendingTx, handleHarvest],
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
        <StyledBalanceText value={balance} />
        <PriceText value={price} prefix="=" />
      </TokenValueWrap>
    </Flex>
  }, [])

  return (
    <>
      <Box>
        <Wrap isInFarmAndPool={isInFarmAndPool}>
          <Box>
            <TitleSection>{t('Earned Token')}</TitleSection>
            <HarvestInfo>
              <Flex flexDirection="column">
                {
                  allEarnings.length > 0 && allEarnings.map((item) => renderEarnedPrice(item.symbol, item.earnings, getPrice(item.earnings, convertToPriceFromSymbol(item.symbol))))
                }
              </Flex>
              {isInFarmAndPool && <HarvestButtonSectionInFarm>{renderHarvestButton}</HarvestButtonSectionInFarm>}
            </HarvestInfo>
          </Box>

          {isInFarmAndPool ? null : (
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

const Wrap = styled(Flex)<{ isInFarmAndPool: boolean }>`
  flex-direction: ${({ isInFarmAndPool }) => (isInFarmAndPool ? 'column' : 'row')};
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
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