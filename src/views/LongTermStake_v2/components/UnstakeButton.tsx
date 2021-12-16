import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, useModal } from '@fingerlabs/definixswap-uikit-v2'
import { useApr } from 'hooks/useLongTermStake'

import UnstakeModal from './UnstakeModal'
import { AllDataLockType, IsMobileType } from './types'

interface UnstakeButtonProps extends IsMobileType {
  data: AllDataLockType
}

const UnstakeButton: React.FC<UnstakeButtonProps> = ({ isMobile, data }) => {
  const { t } = useTranslation()
  const apr = useApr()
  const [receiveToken, setReceiveToken] = useState<number>(0)

  const getApr = (days: number) => {
    if (days === 90) return apr
    if (days === 180) return apr * 2
    return apr * 4
  }
  const getFee = (days: number) => {
    if (days === 90) return 15
    if (days === 180) return 25
    return 40
  }

  const [onPresentUnstakeModal] = useModal(
    <UnstakeModal
      canBeUnlock={data.canBeUnlock}
      balance={data.lockAmount}
      period={data.days}
      apr={getApr(data.days)}
      fee={getFee(data.days)}
      periodPenalty={data.periodPenalty}
      received={receiveToken}
      onOK={() => handleUnstake()}
    />,
    false,
  )

  const handleClaim = () => {
    console.log('handleClaim') // eslint-disable-line no-console
  }

  const handleUnstake = () => {
    console.log('handleUnstake') // eslint-disable-line no-console
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
      <Button width={`${isMobile ? '100%' : '128px'}`} variant="lightbrown" onClick={() => handleClaim()}>
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
      <Button width={`${isMobile ? '100%' : '128px'}`} variant="lightbrown" onClick={onPresentUnstakeModal}>
        {t('Unstake')}
      </Button>
    ) : (
      <Button width={`${isMobile ? '100%' : '128px'}`} variant="lightbrown" onClick={onPresentUnstakeModal}>
        {t('Early Unstake')}
      </Button>
    )
  }

  const handleNotIsunlocked = (item: AllDataLockType) => {
    return item.isPenalty ? handleClaimed(item) : handleCanUnlock(item)
  }

  useEffect(() => {
    setReceiveToken(data.lockAmount - (data.lockAmount * getFee(data.days)) / 100)

    return () => setReceiveToken(0)
  }, [data])

  return <>{data.isUnlocked ? handleIsunlocked(data) : handleNotIsunlocked(data)}</>
}

export default UnstakeButton
