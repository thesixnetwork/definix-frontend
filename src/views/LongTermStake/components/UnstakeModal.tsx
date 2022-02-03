import React, { useState, useCallback } from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { useTranslation, Trans } from 'react-i18next'
import {
  Box,
  Flex,
  Text,
  Modal,
  Button,
  Divider,
  VDivider,
  ImgTokenFinixIcon,
  AlertIcon,
  ModalBody,
  ModalFooter,
} from '@fingerlabs/definixswap-uikit-v2'
import { useUnstakeId, useUnLock } from 'hooks/useLongTermStake'
import { useToast } from 'state/hooks'
import styled from 'styled-components'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'

interface ModalProps {
  onDismiss?: () => any
}

const StyledBox = styled(Box)`
  width: 100%;

  @media (min-width: 464px) {
    width: 416px;
  }
`

const UnstakeModal: React.FC<ModalProps> = ({ onDismiss = () => null }) => {
  const { t, i18n } = useTranslation()
  const { id, amount, canBeUnlock, penaltyRate, periodPenalty, multiplier, days, vFinixPrice } = useUnstakeId()
  const { unLock } = useUnLock()
  const [isLoadingUnLock, setIsLoadingUnLock] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()

  const getEndDay = (endDay: string) => {
    if (i18n.language === 'ko') {
      return moment(endDay).format(`YYYY-MM-DD HH:mm:ss`)
    }
    return moment(endDay).format(`DD-MMM-YYYY HH:mm:ss`)
  }

  const handleUnLock = useCallback(async () => {
    try {
      setIsLoadingUnLock(true)
      await unLock(id)
      toastSuccess(t('{{Action}} Complete', { Action: canBeUnlock ? t('actionEarly Unstake') : t('actionUnstake') }))
    } catch (e) {
      toastError(t('{{Action}} Failed', { Action: canBeUnlock ? t('actionEarly Unstake') : t('actionUnstake') }))
    } finally {
      setIsLoadingUnLock(false)
      onDismiss()
    }
  }, [unLock, id, onDismiss, canBeUnlock, toastSuccess, toastError, t])

  return (
    <Modal title={`${t('Confirm Unstake')}`} onDismiss={onDismiss} mobileFull>
      <ModalBody isBody>
        <StyledBox mb="S_10">
          <Flex mt="S_14" justifyContent="space-between" alignItems="flex-start">
            <Flex alignItems="flex-start">
              <ImgTokenFinixIcon viewBox="0 0 48 48" width="32px" height="32px" />
              <Flex ml="S_10" mt="S_4" flexDirection="column">
                <Text textStyle="R_16M" color="black">
                  {t('FINIX')}
                </Text>
                <Flex my="S_4" alignItems="center">
                  <Text mr="S_8" textStyle="R_14R" color="mediumgrey">
                    {t(`${days} days`)}
                  </Text>
                  <Flex height="12px">
                    <VDivider color="lightgrey" />
                  </Flex>
                  <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                    {t('APR')} {`${numeral(vFinixPrice * multiplier || 0).format('0,0.[00]')}%`}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Text mt="S_4" textStyle="R_16R" color="black">
              {getBalanceOverBillion(amount)}
            </Text>
          </Flex>
          {canBeUnlock ? (
            <>
              <Divider mt="S_24" />
              <Flex mt="S_24" flexDirection="column">
                <Flex mb="S_8" justifyContent="space-between">
                  <Text textStyle="R_14R" color="mediumgrey">
                    {t('Early Unstake Fee')}
                  </Text>
                  <Text textStyle="R_14M" color="deepgrey">
                    {penaltyRate}%
                  </Text>
                </Flex>
                <Flex mb="S_8" justifyContent="space-between">
                  <Text textStyle="R_14R" color="mediumgrey">
                    {t('Lock Up Period End')}
                  </Text>
                  <Flex flexDirection="column" alignItems="flex-end">
                    <Text textStyle="R_14M" color="deepgrey">
                      {getEndDay(periodPenalty)}
                    </Text>
                    <Text textStyle="R_12R" color="mediumgrey">
                      *GMT +9 {t('Asia/Seoul')}
                    </Text>
                  </Flex>
                </Flex>
                <Flex mb="S_8" justifyContent="space-between">
                  <Text textStyle="R_14R" color="mediumgrey">
                    {t('vFINIX to return')}
                  </Text>
                  <Text textStyle="R_14M" color="deepgrey">
                    {getBalanceOverBillion(amount * multiplier)} {t('vFINIX')}
                  </Text>
                </Flex>
                <Flex mb="S_8" justifyContent="space-between">
                  <Text textStyle="R_14R" color="mediumgrey">
                    {t('You will receive')}
                  </Text>
                  <Text textStyle="R_14M" color="deepgrey">
                    {getBalanceOverBillion(amount - (penaltyRate * amount) / 100)} {t('FINIX')}
                  </Text>
                </Flex>
                <Flex mt="S_12" alignItems="flex-start">
                  <Flex mt="S_2">
                    <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
                  </Flex>
                  <Text ml="S_4" textStyle="R_14R" color="red" width="396px">
                    <Trans
                      i18nKey="Do you want to unstake?"
                      values={{ 'Lock Up Period End': `${getEndDay(periodPenalty)} GMT+9` }}
                      components={[<strong />]}
                    />
                  </Text>
                </Flex>
              </Flex>
            </>
          ) : (
            <>
              <Divider mt="S_24" />
              <Flex mt="S_24" flexDirection="column">
                <Flex mb="S_8" justifyContent="space-between">
                  <Text textStyle="R_14R" color="mediumgrey">
                    {t('You will receive')}
                  </Text>
                  <Text textStyle="R_14M" color="deepgrey">
                    {getBalanceOverBillion(amount)} {t('FINIX')}
                  </Text>
                </Flex>
                <Flex mb="S_8" justifyContent="space-between">
                  <Text textStyle="R_14R" color="mediumgrey">
                    {t('Recall vFINIX')}
                  </Text>
                  <Text textStyle="R_14M" color="deepgrey">
                    {getBalanceOverBillion(amount * multiplier)} {t('vFINIX')}
                  </Text>
                </Flex>
              </Flex>
            </>
          )}
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        {canBeUnlock ? (
          <Button height="48px" isLoading={isLoadingUnLock} onClick={handleUnLock}>
            {t('Early Unstake')}
          </Button>
        ) : (
          <Button height="48px" isLoading={isLoadingUnLock} onClick={handleUnLock}>
            {t('Unstake')}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}

export default UnstakeModal
