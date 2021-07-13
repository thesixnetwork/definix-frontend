import React from 'react'
import { Button, useWalletModal } from 'uikit-dev'
import { useWallet } from '@kanthakarn-test/klaytn-use-wallet'
import { useTranslation } from 'contexts/Localization'

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
