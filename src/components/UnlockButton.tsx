import React from 'react'
import { Button, ButtonVariants, ButtonScales } from 'definixswap-uikit'
import { useWalletModal } from 'uikit-dev'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import useI18n from 'hooks/useI18n'

const UnlockButton = (props) => {
  const TranslateString = useI18n()
  const { connect, reset } = useWallet()
  const { onPresentConnectModal } = useWalletModal(connect, reset)

  return (
    <Button
      width="100%"
      variant={ButtonVariants.BROWN}
      scale={ButtonScales.S_40}
      onClick={onPresentConnectModal}
      {...props}
    >
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
