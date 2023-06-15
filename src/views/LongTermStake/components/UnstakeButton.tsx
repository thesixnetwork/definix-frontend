import React, { useState, useCallback } from 'react'
import { get } from 'lodash-es'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Button, useModal, Text, Flex } from '@fingerlabs/definixswap-uikit-v2'
import { useClaim, useApr } from 'hooks/useLongTermStake'
import { useAvailableVotes } from 'hooks/useVoting'
import { useToast } from 'state/hooks'
import { fetchIdData } from 'state/longTermStake'

import UnstakeModal from './UnstakeModal'
import UnstakeImpossibleModal from './UnstakeImpossibleModal'
import { AllDataLockType, IsMobileType } from './types'

interface UnstakeButtonProps extends IsMobileType {
  data: AllDataLockType
}

const StyledButton = styled(Button)`
  width: 110px;
  height: 32px;
  margin-right: 20px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
    height: 40px;
    margin-right: 0px;
  }
`

const UnstakeButton: React.FC<UnstakeButtonProps> = ({ isMobile, data }) => {
  const { t } = useTranslation()
  const [isLoadingClaim, setIsLoadingClaim] = useState<boolean>(false)
  const { availableVotes } = useAvailableVotes()
  const apr = useApr()

  const dispatch = useDispatch()
  const { onClaim } = useClaim()
  const { toastSuccess, toastError } = useToast()

  const [onPresentUnstakeModal] = useModal(<UnstakeModal />, false)
  const [onPresentUnstakeImpossibleModal] = useModal(
    <UnstakeImpossibleModal days={data.days} amount={data.lockAmount} apr={apr} multiplier={data.multiplier} />,
    false,
  )

  const handleClaim = useCallback(
    async (Id) => {
      try {
        setIsLoadingClaim(true)
        await onClaim(Id)
        toastSuccess(t('{{Action}} Complete', { Action: t('actionClaim') }))
      } catch (e) {
        toastError(t('{{Action}} Failed', { Action: t('actionClaim') }))
      } finally {
        setIsLoadingClaim(false)
      }
    },
    [onClaim, toastSuccess, toastError, t],
  )

  const onUnStake = useCallback(
    (Id, Level, Amount, IsPenalty, CanBeUnlock, PenaltyRate, PeriodPenalty, Multiplier, Days) => {
      dispatch(fetchIdData(Id, Level, Amount, IsPenalty, CanBeUnlock, PenaltyRate, PeriodPenalty, Multiplier, Days))
    },
    [dispatch],
  )

  const handleUnstake = (item: AllDataLockType) => {
    if (Number(availableVotes) < item.lockAmount * item.multiplier) {
      onPresentUnstakeImpossibleModal()
      return
    }

    onUnStake(
      get(item, 'id'),
      get(item, 'level'),
      get(item, 'lockAmount'),
      get(item, 'isPenalty'),
      !get(item, 'canBeUnlock'),
      get(item, 'penaltyRate'),
      get(item, 'periodPenalty'),
      get(item, 'multiplier'),
      get(item, 'days'),
    )
    onPresentUnstakeModal()
  }

  const handleIsunlocked = (item: AllDataLockType) => {
    return item.isPenalty ? (
      <StyledButton variant="lightbrown" disabled>
        <Text textStyle={isMobile ? 'R_14B' : 'R_12B'} color="white">
          {t('Claimed')}
        </Text>
      </StyledButton>
    ) : (
      <StyledButton variant="lightbrown" disabled>
        <Text textStyle={isMobile ? 'R_14B' : 'R_12B'} color="white">
          {t('Unstaked')}
        </Text>
      </StyledButton>
    )
  }

  const handleClaimed = (item: AllDataLockType) => {
    return item.canBeClaim ? (
      <StyledButton variant="lightbrown" isLoading={isLoadingClaim} onClick={() => handleClaim(get(item, 'id'))}>
        <Text textStyle={isMobile ? 'R_14B' : 'R_12B'} color="white">
          {t('Claim')}
        </Text>
      </StyledButton>
    ) : (
      <StyledButton variant="lightbrown" disabled>
        <Text textStyle={isMobile ? 'R_14B' : 'R_12B'} color="white">
          {t('Claim')}
        </Text>
      </StyledButton>
    )
  }

  const handleCanUnlock = (item: AllDataLockType) => {
    return item.canBeUnlock ? (
      <StyledButton variant="lightbrown" onClick={() => handleUnstake(item)}>
        <Text textStyle={isMobile ? 'R_14B' : 'R_12B'} color="white">
          {t('Unstake')}
        </Text>
      </StyledButton>
    ) : (
      <StyledButton variant="lightbrown" onClick={() => handleUnstake(item)}>
        <Text textStyle={isMobile ? 'R_14B' : 'R_12B'} color="white">
          {t('Early Unstake')}
        </Text>
      </StyledButton>
    )
  }

  const handleNotIsunlocked = (item: AllDataLockType) => {
    return item.isPenalty ? handleClaimed(item) : handleCanUnlock(item)
  }

  return <Flex alignItems="center">{data.isUnlocked ? handleIsunlocked(data) : handleNotIsunlocked(data)}</Flex>
}

export default UnstakeButton