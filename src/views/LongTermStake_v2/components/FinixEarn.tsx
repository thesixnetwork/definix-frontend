import React, { useState, useCallback } from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button, FireIcon, useModal } from '@fingerlabs/definixswap-uikit-v2'
import { useHarvest } from 'hooks/useLongTermStake'
import { useToast } from 'state/hooks'
import styled from 'styled-components'

import SuperStakeModal from './SuperStakeModal'
import { IsMobileType } from './types'

interface FinixEarnProps extends IsMobileType {
  finixEarn: number
}

const FlexEarn = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`

const StyledButtonFlex = styled(Flex)<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '100%' : 'auto')};
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'row' : 'column')};
  margin-top: ${({ $isMobile }) => ($isMobile ? '20px' : '0px')};
`

const FinixEarn: React.FC<FinixEarnProps> = ({ isMobile, finixEarn }) => {
  const { t } = useTranslation()
  const { handleHarvest } = useHarvest()
  const [isLoadingHarvest, setIsLoadingHarvest] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()

  const [onPresentsuperStakeModal] = useModal(<SuperStakeModal />, false)

  const onHarvest = useCallback(async () => {
    try {
      setIsLoadingHarvest(true)
      await handleHarvest()
      toastSuccess(t('{{Action}} Complete', { Action: t('actionHarvest') }))
    } catch (e) {
      toastError(t('{{Action}} Failed', { Action: t('actionHarvest') }))
    } finally {
      setIsLoadingHarvest(false)
    }
  }, [handleHarvest, toastSuccess, toastError, t])

  const renderHarvestButton = useCallback(
    () => (
      <StyledButtonFlex $isMobile={isMobile}>
        <Button
          variant="red"
          width={`${isMobile ? '50%' : '156px'}`}
          isLoading={isLoadingHarvest}
          disabled={!finixEarn}
          onClick={onHarvest}
        >
          {t('Harvest')}
        </Button>
        <Button
          variant="yellow"
          width={`${isMobile ? '50%' : '156px'}`}
          mt={`${!isMobile && 'S_8'}`}
          ml={`${isMobile && 'S_8'}`}
          disabled={!finixEarn}
          onClick={onPresentsuperStakeModal}
        >
          {t('Super Stake')}
        </Button>
      </StyledButtonFlex>
    ),
    [t, isMobile, finixEarn, isLoadingHarvest, onHarvest, onPresentsuperStakeModal],
  )

  return (
    <>
      <FlexEarn px={isMobile ? 'S_20' : 'S_40'} py={isMobile ? 'S_20' : 'S_32'}>
        <Flex flexDirection="column">
          <Flex mb={`${isMobile ? '16px' : '12px'}`} alignItems="center">
            <FireIcon
              viewBox="0 0 44 44"
              width={`${isMobile ? '24px' : '28px'}`}
              height={`${isMobile ? '24px' : '28px'}`}
            />
            <Text ml="S_4" textStyle={`${isMobile ? 'R_14M' : 'R_16M'}`} color="white" style={{ opacity: '0.7' }}>
              {t('Total Finix Earned')}
            </Text>
          </Flex>
          <Flex alignItems="flex-end">
            <Text textStyle={`${isMobile ? 'R_23B' : 'R_28B'}`} color="white">
              {numeral(finixEarn).format('0,0.[00]')}
            </Text>
            <Text ml="S_6" mb={`${!isMobile && 'S_4'}`} textStyle={`${isMobile ? 'R_14M' : 'R_16M'}`} color="white">
              {t('FINIX')}
            </Text>
          </Flex>
        </Flex>
        {renderHarvestButton()}
      </FlexEarn>
    </>
  )
}

export default FinixEarn
