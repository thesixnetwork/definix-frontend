import React from 'react'
import { Button, ButtonProps, ButtonScales, useWalletModal } from '@fingerlabs/definixswap-uikit-v2'
import { Trans, useTranslation } from 'react-i18next'
import useWallet from 'hooks/useWallet'

const ConnectWalletButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation()
  const { account, activate: login, deactivate: logout } = useWallet()

  const { onPresentConnectModal } = useWalletModal(Trans, login, logout, account)

  return (
    <Button scale={ButtonScales.LG} width="100%" onClick={onPresentConnectModal} {...props}>
      {t('Unlock Wallet')}
    </Button>
  )
}

export default ConnectWalletButton
