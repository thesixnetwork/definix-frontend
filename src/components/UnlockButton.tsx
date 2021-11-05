import React from 'react'
import { Button } from 'definixswap-uikit'
import { useWalletModal } from 'uikit-dev'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import useTranslation from 'contexts/Localisation/useTranslation'

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
