import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React, { useState, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { QuoteToken } from 'config/constants/types'
import { useHarvest } from 'hooks/useHarvest'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { Button, Text, ButtonVariants, Flex, Box, Label } from 'definixswap-uikit'
import CurrencyText from 'components/CurrencyText'

interface FarmCardActionsProps {
  isMobile: boolean
  pid?: number
  earnings: BigNumber
  componentType: string
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ isMobile, pid, earnings, componentType = 'farm' }) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const navigate = useHistory()
  const [pendingTx, setPendingTx] = useState(false)
  const isInFarm = useMemo(() => componentType === 'farm', [componentType])

  // const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)
  const { onReward } = useHarvest(pid)
  const { convertToPriceFromSymbol, convertToBalanceFormat } = useConverter()

  const finixPrice = convertToPriceFromSymbol(QuoteToken.FINIX)
  const finixEarningsValue = useMemo(() => getBalanceNumber(earnings), [earnings])
  const earningsPrice = useMemo(() => {
    return new BigNumber(finixEarningsValue).multipliedBy(finixPrice).toNumber()
  }, [finixEarningsValue, finixPrice])

  const handleHarvest = useCallback(async () => {
    try {
      setPendingTx(true)
      await onReward()
      // toastSuccess('harvest success')
    } catch (error) {
      // toastError('harvest fail')
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  const handleGoToDetail = useCallback(() => {
    navigate.push('/farm')
  }, [navigate])

  const Wrap = styled(Flex)<{ isInFarm: boolean }>`
    flex-direction: ${isInFarm ? 'column' : 'row'};
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
  const HarvestButtonInFarm = styled(Box)`
    width: 100px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-top: ${({ theme }) => theme.spacing.S_20}px;
      width: 100%;
    }
  `
  const HarvestButtonInMyInvestment = styled(Flex)`
    flex-direction: column;
    justify-content: center;
    width: 100px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: row;
      margin-top: ${({ theme }) => theme.spacing.S_28}px;
      width: 100%;
    }
  `

  const HarvestButton = () => (
    <Button
      variant={ButtonVariants.RED}
      width="100%"
      disabled={finixEarningsValue === 0 || pendingTx}
      onClick={handleHarvest}
    >
      {t('Harvest')}
    </Button>
  )
  const DetailButton = () => (
    <Button
      variant={ButtonVariants.BROWN}
      width="100%"
      onClick={handleGoToDetail}
      className={isMobile ? 'ml-s16' : 'mt-s8'}
    >
      {t('Detail')}
    </Button>
  )

  return (
    <>
      <Box>
        <Wrap isInFarm={isInFarm}>
          <Box>
            <TitleSection>{t('Earned Token')}</TitleSection>
            <HarvestInfo>
              <Flex>
                <TokenLabel type="token">FINIX</TokenLabel>
                <Box>
                  <BalanceText>{convertToBalanceFormat(finixEarningsValue)}</BalanceText>
                  <PriceText value={earningsPrice} prefix="=" />
                </Box>
              </Flex>
              {isInFarm && (
                <HarvestButtonInFarm>
                  <HarvestButton />
                </HarvestButtonInFarm>
              )}
            </HarvestInfo>
          </Box>

          {isInFarm ? null : (
            <HarvestButtonInMyInvestment>
              <HarvestButton />
              <DetailButton />
            </HarvestButtonInMyInvestment>
          )}
        </Wrap>
      </Box>
    </>
  )
}

export default HarvestAction
