import React from 'react'
import { Button, useWalletModal } from 'uikit-dev'
import { useTranslation } from 'contexts/Localization'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { connect, reset } = useWallet()
  const { onPresentConnectModal } = useWalletModal(connect, reset)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {t('Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
