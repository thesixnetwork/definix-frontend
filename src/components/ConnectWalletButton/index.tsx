import React from 'react'
import { Button, ButtonProps, ButtonScales, useWalletModal } from '@fingerlabs/definixswap-uikit-v2'
import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { Trans, useTranslation } from 'react-i18next'
import useCaverJsReactForWallet from 'hooks/useCaverJsReactForWallet'

const UnlockButton: React.FC<ButtonProps> = props => {
  const { t } = useTranslation();
  const { account } = useCaverJsReact()
  const { login, logout } = useCaverJsReactForWallet();

  const { onPresentConnectModal } = useWalletModal(Trans, login, logout, account)

  return (
    <Button 
      scale={ButtonScales.LG}
      width="100%"
      onClick={onPresentConnectModal}
      {...props}
    >
      {t('Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
