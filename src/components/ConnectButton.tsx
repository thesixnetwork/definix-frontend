import React from 'react'
import { Button, useWalletModal } from 'uikit-dev'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'

const ConnectButton = (props) => {
  const TranslateString = useI18n()
  const { connect, reset } = useWallet()
  const { onPresentConnectModal } = useWalletModal(connect, reset)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'Connect Wallet')}
    </Button>
  )
}

export default ConnectButton
