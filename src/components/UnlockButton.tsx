import React from 'react'
import { Button, ButtonVariants } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import { useWalletModal } from 'uikit-dev'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { connect, reset } = useWallet()
  const { onPresentConnectModal } = useWalletModal(connect, reset)

  return (
    <Button width="100%" variant={ButtonVariants.BROWN} md onClick={onPresentConnectModal} {...props}>
      {t('Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
