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
import { repeat } from 'lodash'
// import AirDropHarvestModal from './AirDropHarvestModal'

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
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()

  const finixPrice = convertToPriceFromSymbol(QuoteToken.FINIX)
  const finixEarningsValue = useMemo(() => getBalanceNumber(earnings), [earnings])
  const earningsPrice = useCallback(
    (value) => {
      return convertToUSD(new BigNumber(value).multipliedBy(finixPrice), 2)
    },
    [finixPrice, convertToUSD],
  )
  const toLocaleString = useCallback((value: number) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }, [])

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

  const HarvestButtonInMyInvestment = styled(Flex)`
    flex-direction: column;
    justify-content: center;
    width: 100px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: row;
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
        <Flex flexDirection={isInFarm || isMobile ? 'column' : 'row'} justifyContent="space-between">
          <Box>
            <Text textStyle="R_12R" color={ColorStyles.MEDIUMGREY} className="mb-s8">
              Earned Token
            </Text>
            <Flex justifyContent="space-between" flexDirection={isMobile ? 'column' : 'row'}>
              <Flex>
                <Label type="token">FINIX</Label>
                <Box className="ml-s16">
                  <Text textStyle="R_18M" color={ColorStyles.BLACK}>
                    {toLocaleString(finixEarningsValue)}
                  </Text>
                  <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
                    = {earningsPrice(finixEarningsValue)}
                  </Text>
                </Box>
              </Flex>
              {isInFarm && (
                <Box className={`w-full ${isMobile ? 'mt-s28' : ''}`}>
                  <HarvestButton />
                </Box>
              )}
            </Flex>
          </Box>

          {isInFarm ? null : (
            <HarvestButtonInMyInvestment className={isMobile ? 'mt-s28' : ''}>
              <HarvestButton />
              <DetailButton />
            </HarvestButtonInMyInvestment>
          )}
        </Flex>
      </Box>
      <ToastContainer toasts={toasts} onRemove={hideToast} />
    </>
  )
}

export default HarvestAction
