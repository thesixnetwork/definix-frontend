import React from 'react'
import { Modal } from '../Modal'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'

interface Props {
  login: Login
  onDismiss?: () => void
}

const ConnectModal: React.FC<Props> = ({ login, onDismiss = () => null }) => (
  <Modal title="Connect to a wallet" onDismiss={onDismiss} isRainbow={false}>
    {config.map((entry, index) => (
      <WalletCard
        key={entry.title}
        login={login}
        walletConfig={entry}
        onDismiss={onDismiss}
        mb={index < config.length - 1 ? '8px' : '0'}
      />
    ))}
    {/* <HelpLink
      href="https://docs.definixswap.finance/guides/faq#how-do-i-set-up-my-wallet-on-binance-smart-chain"
      external
    >
      <HelpIcon color="primary" mr="6px" />
      Learn how to connect
    </HelpLink> */}
  </Modal>
)

export default ConnectModal
