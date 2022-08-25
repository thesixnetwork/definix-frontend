import { Box, Button } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import Dropdown from 'uikit-dev/components/Dropdown/Dropdown'
import { Position } from 'uikit-dev/components/Dropdown/types'
import LinkExternal from 'uikit-dev/components/Link/LinkExternal'
import Text from 'uikit-dev/components/Text/Text'
import { useWalletModal } from 'uikit-dev/widgets/WalletModal'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import { Login } from 'uikit-dev/widgets/WalletModal/types'
import { localStorageKey } from 'uikit-dev/widgets/WalletModal/config'

interface Props {
  account?: string
  login: Login
  logout: () => void
  className?: string
  position?: Position
  size?: any
}

const ConnectButton = styled(Button)`
  padding: 4px !important;
  box-shadow: ${({ theme }) => theme.shadows.elevation1} !important;
  background: ${({ theme }) => theme.colors.connectBtnBorder} !important;

  > div {
    background: #8b0000;
    border-radius: ${({ theme }) => theme.radii.large};
    padding: 0 16px;
    display: block;
    height: 24px;
    line-height: 24px;
  }
`

const AccountButton = styled(ConnectButton)`
  > div {
    background: ${({ theme }) => theme.colors.connectBtnInner};
  }
`

const UserBlockV2: React.FC<Props> = ({
  account,
  login,
  logout,
  className = '',
  position = 'bottom-right',
  size = 'small',
}) => {
  const { onPresentConnectModal } = useWalletModal(login, logout, account)
  const accountEllipsis = account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : null

  return (
    <Box className={className}>
      {account ? (
        <Dropdown
          position={position}
          isRainbow={false}
          target={
            <AccountButton
              size="small"
              fullWidth
              variant="text"
              className="connect-btn"
              // onClick={() => {
              //   onPresentAccountModal()
              // }}
            >
              <Text fontSize="12px" color="white" fontWeight="600">
                {accountEllipsis}
              </Text>
            </AccountButton>
          }
        >
          <div style={{ zIndex: 999 }}>
            <Text fontSize="16px !important" className="mb-3 pa-0 pt-2" fontWeight="600">
              {accountEllipsis}
            </Text>
            <LinkExternal
              isIconLeft
              small
              href={`https://bscscan.com/address/${account}`}
              className="mb-2"
              fontSize="13px"
            >
              View on BscScan
            </LinkExternal>
            <CopyToClipboard noPadding toCopy={account}>
              Copy Address
            </CopyToClipboard>
            <Button
              size="small"
              fullWidth
              className="mt-4"
              onClick={() => {
                logout()
                window.localStorage.removeItem('connector')
                window.localStorage.removeItem(localStorageKey)
                window.location.reload()
              }}
            >
              Disconnect
            </Button>
          </div>
        </Dropdown>
      ) : (
        <Button
          onClick={() => {
            onPresentConnectModal()
          }}
          disabled={!!account}
          variant="contained"
          size={size}
          className="px-5"
          sx={{ width: size === 'small' ? '142px' : '186px' }}
        >
          Connect Wallet
        </Button>
      )}
    </Box>
  )
}

export default UserBlockV2
