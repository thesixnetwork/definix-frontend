import { Link } from '@mui/material'
import React from 'react'
import config from 'uikit-dev/widgets/WalletModal/config'
import { Login } from 'uikit-dev/widgets/WalletModal/types'
import WalletCard from 'uikit-dev/widgets/WalletModal/WalletCard'
import ModalV2 from './ModalV2'

interface Props {
  login: Login
  onDismiss?: () => void
}

const ConnectModalV2: React.FC<Props> = ({ login, onDismiss = () => null }) => (
  <ModalV2 title="Connect to a wallet" onDismiss={onDismiss}>
    {config.map((entry, index) => (
      <WalletCard
        key={entry.title}
        login={login}
        walletConfig={entry}
        onDismiss={onDismiss}
        mb={index < config.length - 1 ? '8px' : '0'}
      />
    ))}

    <Link
      variant="body2"
      color="text.primary"
      textAlign="center"
      href="https://sixnetwork.gitbook.io/definix/guides-and-faqs/how-to-use-metamask-on-definix"
      target="_blank"
    >
      Learn how to connect wallet
    </Link>
  </ModalV2>
)

export default ConnectModalV2
