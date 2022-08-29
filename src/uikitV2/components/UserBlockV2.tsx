import { CheckRounded } from '@mui/icons-material'
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import { Position } from 'uikit-dev/components/Dropdown/types'
import { useWalletModal } from 'uikit-dev/widgets/WalletModal'
import { localStorageKey } from 'uikit-dev/widgets/WalletModal/config'
import { Login } from 'uikit-dev/widgets/WalletModal/types'

interface Props {
  account?: string
  login: Login
  logout: () => void
  className?: string
  position?: Position
  size?: any
}

const UserBlockV2: React.FC<Props> = ({ account, login, logout, className = '', size = 'small' }) => {
  const { onPresentConnectModal } = useWalletModal(login, logout, account)
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [isCopied, setIsCopied] = React.useState(false)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box className={className}>
      {account ? (
        <>
          <Button size="small" color="info" fullWidth variant="contained" sx={{ width: '110px' }} onClick={handleClick}>
            {accountEllipsis}
          </Button>

          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
            PaperProps={{ sx: { width: '190px' } }}
          >
            <MenuItem onClick={handleClose} href={`https://bscscan.com/address/${account}`} target="_blank">
              <Typography variant="caption">View on BscScan</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(account)
                  setIsCopied(true)
                  setTimeout(() => {
                    setIsCopied(false)
                  }, 2000)
                }
              }}
            >
              <Typography
                variant="caption"
                component="p"
                className="flex align-center justify-space-between"
                sx={{ width: '100%' }}
              >
                Copy Address
                {isCopied && (
                  <Typography variant="caption" color="text.disabled" className="flex align-center">
                    <CheckRounded sx={{ fontSize: '1rem' }} className="mr-1" /> Copied
                  </Typography>
                )}
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose()
                logout()
                window.localStorage.removeItem('connector')
                window.localStorage.removeItem(localStorageKey)
                window.location.reload()
              }}
              className="bd-t"
            >
              <Typography variant="caption">Disconnect</Typography>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          onClick={onPresentConnectModal}
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
