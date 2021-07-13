import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React, { useMemo, useState } from 'react'
import { Button, Modal } from 'uikit-dev'
import ModalActions from 'components/ModalActions'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface DepositModalProps {
  earnings: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
}

const CompoundModal: React.FC<DepositModalProps> = ({ earnings, onConfirm, onDismiss, tokenName = '' }) => {
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(earnings)
  }, [earnings])

  return (
    <Modal title={`${t('Compound')} ${t(`${tokenName} Earned`)}`} onDismiss={onDismiss} isRainbow>
      <BalanceRow>
        <Balance value={Number(fullBalance)} />
      </BalanceRow>
      <ModalActions>
        <Button fullWidth variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <Button
          id="compound-finix"
          fullWidth
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(fullBalance)
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? t('Pending Confirmation') : t('Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default CompoundModal

const BalanceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`
