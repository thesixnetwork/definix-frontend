import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, useModal } from '@fingerlabs/definixswap-uikit-v2'
import { useApr } from 'hooks/useLongTermStake'

import UnstakeModal from './UnstakeModal'
import { IsMobileType } from './types'

interface UnstakeButtonProps extends IsMobileType {
  balance: number
  period: number
  periodPenalty: string
}

const UnstakeButton: React.FC<UnstakeButtonProps> = ({ isMobile, balance, period, periodPenalty }) => {
  const { t } = useTranslation()
  const apr = useApr()
  const [receiveToken, setReceiveToken] = useState<number>(0)
  const [early] = useState<boolean>(true)

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
      early={early}
      balance={balance}
      period={period}
      apr={getApr(period)}
      fee={getFee(period)}
      periodPenalty={periodPenalty}
      received={receiveToken}
      onOK={() => null}
    />,
    false,
  )

  useEffect(() => {
    setReceiveToken(balance - (balance * getFee(period)) / 100)

    return () => setReceiveToken(0)
  }, [balance, period])

  return (
    <Button width={`${isMobile ? '100%' : '128px'}`} variant="lightbrown" onClick={onPresentUnstakeModal}>
      {early ? t('Early Unstake') : t('Unstake')}
    </Button>
  )
}

export default UnstakeButton
