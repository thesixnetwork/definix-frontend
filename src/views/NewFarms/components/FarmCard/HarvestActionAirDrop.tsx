import React, { useState, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import BigNumber from 'bignumber.js'
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

  const HarvestButton = () => (
    <Button
      variant={ButtonVariants.RED}
      md
      minWidth="100px"
      disabled={finixEarningsValue === 0 || pendingTx}
      onClick={handleHarvest}
    >
      Harvest
    </Button>
  )

  return (
    <>
      <Box>
        <Flex flexDirection={isInFarm ? 'column' : 'row'} justifyContent="space-between">
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
              {isInFarm && <HarvestButton />}
            </Flex>
          </Box>

          {isInFarm ? null : (
            <Flex flexDirection="column" justifyContent="center">
              <HarvestButton />
              <Button variant={ButtonVariants.BROWN} md minWidth="100px" onClick={handleGoToDetail} className="mt-s8">
                Detail
              </Button>
            </Flex>
          )}
        </Flex>
        {/* {false && (
          <div className="flex align-center justify-space-between">
            <Text color="textSubtle">Claim Ended Bonus</Text>

            <Button onClick={onPresentAirDropHarvestModal} variant="primary" size="sm">
              Claim
            </Button>
          </div>
        )} */}
      </Box>
      <ToastContainer toasts={toasts} onRemove={hideToast} />
    </>
  )
}

export default HarvestAction