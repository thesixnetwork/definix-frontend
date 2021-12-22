import React, { useState, useCallback } from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, useModal } from '@fingerlabs/definixswap-uikit-v2'
import { useClaim } from 'hooks/useLongTermStake'
import { useToast } from 'state/hooks'
import { fetchIdData } from 'state/longTermStake'

import UnstakeModal from './UnstakeModal'
import { AllDataLockType, IsMobileType } from './types'

interface UnstakeButtonProps extends IsMobileType {
  data: AllDataLockType
}

const UnstakeButton: React.FC<UnstakeButtonProps> = ({ isMobile, data }) => {
  const { t } = useTranslation()
  const [isLoadingClaim, setIsLoadingClaim] = useState<boolean>(false)

  const dispatch = useDispatch()
  const { onClaim } = useClaim()
  const { toastSuccess, toastError } = useToast()

  const [onPresentUnstakeModal] = useModal(<UnstakeModal />, false)

  const handleClaim = useCallback(
    async (Id) => {
      try {
        setIsLoadingClaim(true)
        await onClaim(Id)
        toastSuccess(t('{{Action}} Complete', { Action: t('Claim') }))
      } catch (e) {
        toastError(t('{{Action}} Failed', { Action: t('Claim') }))
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
    onUnStake(
      _.get(item, 'id'),
      _.get(item, 'level'),
      _.get(item, 'lockAmount'),
      _.get(item, 'isPenalty'),
      !_.get(item, 'canBeUnlock'),
      _.get(item, 'penaltyRate'),
      _.get(item, 'periodPenalty'),
      _.get(item, 'multiplier'),
      _.get(item, 'days'),
    )
    onPresentUnstakeModal()
  }

  const handleIsunlocked = (item: AllDataLockType) => {
    return item.isPenalty ? (
      <Button width={`${isMobile ? '100%' : '128px'}`} variant="lightbrown" disabled>
        {t('Claimed')}
      </Button>
    ) : (
      <Button width={`${isMobile ? '100%' : '128px'}`} variant="lightbrown" disabled>
        {t('Unstaked')}
      </Button>
    )
  }

  const handleClaimed = (item: AllDataLockType) => {
    return item.canBeClaim ? (
      <Button
        width={`${isMobile ? '100%' : '128px'}`}
        variant="lightbrown"
        isLoading={isLoadingClaim}
        onClick={() => handleClaim(_.get(item, 'id'))}
      >
        {t('Claim')}
      </Button>
    ) : (
      <Button width={`${isMobile ? '100%' : '128px'}`} variant="lightbrown" disabled>
        {t('Claim')}
      </Button>
    )
  }

  const handleCanUnlock = (item: AllDataLockType) => {
    return item.canBeUnlock ? (
      <Button width={`${isMobile ? '100%' : '128px'}`} variant="lightbrown" onClick={() => handleUnstake(data)}>
        {t('Unstake')}
      </Button>
    ) : (
      <Button width={`${isMobile ? '100%' : '128px'}`} variant="lightbrown" onClick={() => handleUnstake(data)}>
        {t('Early Unstake')}
      </Button>
    )
  }

  const handleNotIsunlocked = (item: AllDataLockType) => {
    return item.isPenalty ? handleClaimed(item) : handleCanUnlock(item)
  }

  return <>{data.isUnlocked ? handleIsunlocked(data) : handleNotIsunlocked(data)}</>
}

export default UnstakeButton
