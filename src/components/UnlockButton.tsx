import React from 'react'
import { Button, ButtonVariants, Login, useWalletModal } from '@fingerlabs/definixswap-uikit-v2'
import { Trans, useTranslation } from 'react-i18next'
import useWallet from 'hooks/useWallet'

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { activate, deactivate } = useWallet()
  const { onPresentConnectModal } = useWalletModal(Trans, activate as Login, deactivate)

  return (
    <Button width="100%" variant={ButtonVariants.BROWN} md onClick={onPresentConnectModal} {...props}>
      {t('Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
