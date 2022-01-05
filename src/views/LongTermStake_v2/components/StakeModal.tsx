import React, { useState, useEffect, useCallback, useMemo } from 'react'
import _ from 'lodash'
import numeral from 'numeral'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { useTranslation, Trans } from 'react-i18next'
import {
  Box,
  Flex,
  Text,
  Modal,
  Button,
  Divider,
  ImgTokenFinixIcon,
  AlertIcon,
  ModalBody,
  ModalFooter,
} from '@fingerlabs/definixswap-uikit-v2'
import { useLock, useLockTopup, useAllDataLock } from 'hooks/useLongTermStake'
import { useLockPlus } from 'hooks/useTopUp'
import { useToast } from 'state/hooks'
import styled from 'styled-components'

interface ModalProps {
  balance: string
  setInputBalance: React.Dispatch<React.SetStateAction<string>>
  days: number
  earn: number
  pathname: string
  onDismiss?: () => any
}

const StyledBox = styled(Box)`
  width: 100%;

  @media (min-width: 464px) {
    width: 416px;
  }
`

const StakeModal: React.FC<ModalProps> = ({
  balance,
  setInputBalance,
  days,
  earn,
  pathname,
  onDismiss = () => null,
}) => {
  const { t, i18n } = useTranslation()
  const finixValue = useMemo(
    () => new BigNumber(parseFloat(balance)).times(new BigNumber(10).pow(18)).toFixed(),
    [balance],
  )
  const isSuperStake = useMemo(() => pathname === '/super-stake', [pathname])

  const getLockDay = (day: number) => {
    switch (day) {
      case 90:
        return 'FINIX amount will be locked 7 days'
      case 180:
        return 'FINIX amount will be locked 14 days'
      case 365:
        return 'FINIX amount will be locked 28 days'
      default:
        return ''
    }
  }

  const getLevel = (day: number) => {
    if (day === 90) return 0
    if (day === 180) return 1
    return 2
  }

  const getEndDay = (day: number) => {
    const today = new Date()

    if (i18n.language === 'ko') {
      return moment(today.setDate(today.getDate() + day)).format(`YYYY-MM-DD HH:mm:ss`)
    }
    return moment(today.setDate(today.getDate() + day)).format(`DD-MMM-YYYY HH:mm:ss`)
  }

  const { onStake, loadings } = useLock(getLevel(days), finixValue)
  const { toastSuccess, toastError } = useToast()

  const onClickStake = useCallback(async () => {
    try {
      await onStake()
      setInputBalance('')
      toastSuccess(t('{{Action}} Complete', { Action: t('actioncStake') }))
    } catch (e) {
      toastError(t('{{Action}} Failed', { Action: t('actioncStake') }))
    } finally {
      onDismiss()
    }
  }, [onStake, toastSuccess, toastError, t, onDismiss, setInputBalance])

  // 슈퍼 스테이크
  const [idLast, setIdLast] = useState<number>(0)
  const lockTopUp = useLockTopup()
  const { allLock } = useAllDataLock()

  const { onLockPlus, loadings: superLoadings } = useLockPlus(getLevel(days), idLast, finixValue)

  const onClickSuperStake = useCallback(async () => {
    try {
      await onLockPlus()
      setInputBalance('')
      toastSuccess(t('{{Action}} Complete', { Action: t('actioncStake') }))
    } catch (e) {
      toastError(t('{{Action}} Failed', { Action: t('actioncStake') }))
    } finally {
      onDismiss()
    }
  }, [onLockPlus, toastSuccess, toastError, t, onDismiss, setInputBalance])

  useEffect(() => {
    return () => setIdLast(0)
  }, [setIdLast])

  useEffect(() => {
    if (lockTopUp !== null && lockTopUp.length > 0) {
      const arrStr = lockTopUp.map((i) => Number(i))
      const removeTopUpId = allLock.filter((item) => !arrStr.includes(Number(_.get(item, 'id'))))
      let max = 0
      for (let i = 0; i < removeTopUpId.length; i++) {
        const selector = removeTopUpId[i]
        const selectorPeriod = getLevel(days) + 1
        if (
          _.get(selector, 'isUnlocked') === false &&
          _.get(selector, 'isPenalty') === false &&
          _.get(selector, 'level') === selectorPeriod
        ) {
          if (Number(_.get(selector, 'id')) >= max) {
            max = Number(_.get(selector, 'id'))
            setIdLast(max)
          }
        }
      }
    } else {
      let max = 0
      for (let i = 0; i < allLock.length; i++) {
        const selector = allLock[i]
        const selectorPeriod = getLevel(days) + 1
        if (
          _.get(selector, 'isUnlocked') === false &&
          _.get(selector, 'isPenalty') === false &&
          _.get(selector, 'level') === selectorPeriod
        ) {
          if (Number(_.get(selector, 'id')) >= max) {
            max = Number(_.get(selector, 'id'))
            setIdLast(max)
          }
        }
      }
    }
  }, [lockTopUp, allLock, days])

  return (
    <Modal title={`${isSuperStake ? t('Confirm Super Stake') : t('Confirm Stake')}`} onDismiss={onDismiss} mobileFull>
      <ModalBody isBody>
        <StyledBox mb="S_30">
          <Flex mt="S_14" mb="S_24" justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <ImgTokenFinixIcon viewBox="0 0 48 48" width="32px" height="32px" />
              <Text ml="S_10" textStyle="R_16M" color="black">
                {t('FINIX')}
              </Text>
            </Flex>
            <Text textStyle="R_16R" color="black">
              {numeral(Number(balance)).format('0,0.[00]')}
            </Text>
          </Flex>
          <Divider />
          <Flex mt="S_24" flexDirection="column">
            <Flex mb="S_8" justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('Stake Period')}
              </Text>
              <Text textStyle="R_14M" color="deepgrey">
                {t(`${days} days`)}
              </Text>
            </Flex>
            <Flex mb="S_8" justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('Period End')}
              </Text>
              <Flex flexDirection="column" alignItems="flex-end">
                <Text textStyle="R_14M" color="deepgrey">
                  {getEndDay(days)}
                </Text>
                <Text textStyle="R_12R" color="mediumgrey">
                  *GMT +9 {t('Asia/Seoul')}
                </Text>
              </Flex>
            </Flex>
            <Flex mb="S_8" justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('vFINIX Earn')}
              </Text>
              <Flex>
                <Text textStyle="R_14M" color="deepgrey">
                  {earn}
                </Text>
                <Text ml="S_4" textStyle="R_14M" color="deepgrey">
                  {t('vFINIX')}
                </Text>
              </Flex>
            </Flex>
            <Flex mt="S_12" alignItems="flex-start">
              <Flex mt="S_2">
                <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              </Flex>
              <Text ml="S_4" textStyle="R_14R" color="red" width="396px">
                <Trans i18nKey={getLockDay(days)} components={[<strong />]} />
              </Text>
            </Flex>
          </Flex>
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        <Button
          height="48px"
          isLoading={isSuperStake ? superLoadings === 'loading' : loadings === 'loading'}
          onClick={isSuperStake ? onClickSuperStake : onClickStake}
        >
          {t('Stake')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default StakeModal
