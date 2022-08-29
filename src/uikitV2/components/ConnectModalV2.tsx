import { Box, Button, Link, styled, Typography } from '@mui/material'
import React from 'react'
import config, { localStorageKey } from 'uikit-dev/widgets/WalletModal/config'
import { Login } from 'uikit-dev/widgets/WalletModal/types'
import ModalV2 from './ModalV2'

interface Props {
  login: Login
  onDismiss?: () => void
}

const WalletStyle = styled(Button)`
  width: 50%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;

  .MuiBox-root {
    width: 36px;
    height: 36px;
    margin-bottom: 8px;

    svg {
      width: 100%;
      height: auto;
    }
  }
`

const Wallet = ({ login, walletConfig, onDismiss }) => {
  const { title, icon } = walletConfig

  return (
    <WalletStyle
      onClick={() => {
        login(walletConfig.connectorId)
        window.localStorage.setItem(localStorageKey, '1')
        window.localStorage.setItem('connector', walletConfig.connectorId)
        onDismiss()
      }}
      color="inherit"
    >
      <Box>{icon()}</Box>
      <Typography variant="body2">{title}</Typography>
    </WalletStyle>
  )
}

const ConnectModalV2: React.FC<Props> = ({ login, onDismiss = () => null }) => (
  <ModalV2
    title="Connect to a wallet"
    onDismiss={onDismiss}
    sx={{
      maxWidth: '320px !important',
      '& .MuiBox-root:nth-child(02)': { display: 'flex', flexDirection: 'column', overflow: 'auto' },
    }}
  >
    <Box display="flex" flexWrap="wrap" mb="auto">
      {config.map((entry) => (
        <Wallet key={entry.title} login={login} walletConfig={entry} onDismiss={onDismiss} />
      ))}
    </Box>

    <Link
      variant="body2"
      color="text.primary"
      textAlign="center"
      href="https://sixnetwork.gitbook.io/definix/guides-and-faqs/how-to-use-metamask-on-definix"
      target="_blank"
      sx={{ display: 'block', m: '24px auto 8px auto' }}
    >
      Learn how to connect wallet
    </Link>
  </ModalV2>
)

export default ConnectModalV2
