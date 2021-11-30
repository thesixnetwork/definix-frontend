import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React, { useState, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { QuoteToken } from 'config/constants/types'
import { useHarvest } from 'hooks/useHarvest'
import useConverter from 'hooks/useConverter'
import { getBalanceNumber } from 'utils/formatBalance'
import {
  Button,
  Text,
  ButtonVariants,
  Flex,
  Box,
  Label,
  ColorStyles,
  alertVariants,
  ToastContainer,
} from 'definixswap-uikit'

interface FarmCardActionsProps {
  isMobile: boolean
  pid?: number
  earnings: BigNumber
  componentType: string
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ isMobile, pid, earnings, componentType = 'farm' }) => {
  const { t } = useTranslation()
  const navigate = useHistory()
  const [pendingTx, setPendingTx] = useState(false)
  const [toasts, setToasts] = useState([])
  const isInFarm = useMemo(() => componentType === 'farm', [componentType])

  // const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)
  const { onReward } = useHarvest(pid)
  const { convertToUSD, convertToPriceFromSymbol, convertToBalanceFormat, convertToPriceFormat } = useConverter()

  const finixPrice = convertToPriceFromSymbol(QuoteToken.FINIX)
  const finixEarningsValue = useMemo(() => getBalanceNumber(earnings), [earnings])
  const earningsPrice = useMemo(() => {
    return convertToPriceFormat(new BigNumber(earnings).multipliedBy(finixPrice).toNumber())
  }, [earnings, finixPrice, convertToPriceFormat])

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

  const handleHarvest = useCallback(async () => {
    try {
      setPendingTx(true)
      await onReward()
      showToast(alertVariants.SUCCESS, 'harvest success')
    } catch (error) {
      showToast(alertVariants.DANGER, 'harvest fail')
    } finally {
      setPendingTx(false)
    }
  }, [onReward, showToast])

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
    margin-bottom: ${({ theme }) => theme.spacing.S_8}
    color: ${({ theme }) => theme.colors.mediumgrey};
    ${({ theme }) => theme.textStyle.R_12R};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-bottom: ${({ theme }) => theme.spacing.S_6}
    }
  `
  const HarvestInfo = styled(Flex)`
    flex-direction: row;
    justify-content: space-between;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: column;
    }
  `
  const BalanceValueSection = styled(Box)`
    margin-left: ${({ theme }) => theme.spacing.S_16} ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-left: ${({ theme }) => theme.spacing.S_12};
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
  const PriceText = styled(Text)`
    color: ${({ theme }) => theme.colors.deepgrey};
    ${({ theme }) => theme.textStyle.R_14R};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_12R};
    }
  `
  const HarvestButtonInFarm = styled(Box)`
    margin-top: ${({ theme }) => theme.spacing.S_28};
    width: 100%;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-top: ${({ theme }) => theme.spacing.S_20};
    }
  `
  const HarvestButtonInMyInvestment = styled(Flex)`
    flex-direction: column;
    justify-content: center;
    width: 100px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: row;
      margin-top: ${({ theme }) => theme.spacing.S_28}
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
                <BalanceValueSection>
                  <BalanceText>{convertToBalanceFormat(finixEarningsValue)}</BalanceText>
                  <PriceText>= {earningsPrice}</PriceText>
                </BalanceValueSection>
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
      <ToastContainer toasts={toasts} onRemove={hideToast} />
    </>
  )
}

export default HarvestAction
