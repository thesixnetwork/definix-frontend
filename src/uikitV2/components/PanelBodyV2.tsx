import { CloseRounded, ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import FinixCoin from 'uikit-dev/images/finix-coin.png'
import { PanelProps, PushedProps } from 'uikit-dev/widgets/Menu/types'
import { Login } from 'uikit-dev/widgets/WalletModal/types'
import definix from '../images/definix-full.svg'
import CopyFinixAddress from './CopyFinixAddress'
import SwitchNetworkV2 from './SwitchNetworkV2'
import UserBlockV2 from './UserBlockV2'

interface Props extends PanelProps, PushedProps {
  isMobile: boolean
  account?: string
  login: Login
  logout: () => void
}

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  margin-bottom: 16px;

  img {
    height: 14px;
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    img {
      height: 24px;
    }
  }
`

const MenuItem = ({ menu }) => {
  const location = useLocation()
  const isActive = location.pathname === menu.href && !menu.notHighlight
  const isExternal = menu.href.indexOf('http') > -1

  return (
    <ListItemButton
      component={isExternal ? 'a' : Link}
      selected={isActive}
      to={menu.href}
      target={menu.newTab ? '_blank' : '_self'}
    >
      <ListItemIcon>
        <img src={menu.icon} alt="" width="24" />
      </ListItemIcon>
      <ListItemText primary={menu.label} />
    </ListItemButton>
  )
}

const GroupMenuItem = ({ menu }) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isActive = menu.items.filter((m) => m.href === location.pathname).length > 0 && !menu.notHighlight
  const isExternal = menu.href.indexOf('http') > -1

  return (
    <Box>
      <ListItemButton
        onClick={() => {
          setOpen(!open)
        }}
      >
        <ListItemIcon>
          <img src={menu.icon} alt="" width="24" />
        </ListItemIcon>
        <ListItemText primary={menu.label} />
        {open || isActive ? <ExpandLessRounded /> : <ExpandMoreRounded />}
      </ListItemButton>

      <Collapse in={open || isActive} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menu.items.map((m) => (
            <ListItemButton
              sx={{ pl: 5 }}
              component={isExternal ? 'a' : Link}
              selected={location.pathname === m.href && !m.notHighlight}
              to={m.href}
              target={m.newTab ? '_blank' : '_self'}
            >
              <ListItemText primary={m.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </Box>
  )
}

const PanelBodyV2: React.FC<Props> = (props) => {
  const theme = useTheme()
  const mdUp = useMediaQuery(theme.breakpoints.up('md'))

  const { links, account, login, logout } = props

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {mdUp ? (
        <Box py="30px" display="flex" justifyContent="center" alignItems="center" flexShrink={0}>
          <MuiLink href="/">
            <img src={definix} alt="Definix" />
          </MuiLink>
        </Box>
      ) : (
        <Box p="12px 16px 12px 24px" display="flex" alignItems="center" justifyContent="space-between">
          <SwitchNetworkV2 />
          <IconButton>
            <CloseRounded />
          </IconButton>
        </Box>
      )}

      <Box flexGrow={1} overflow="auto" height="calc(100% - 94px)">
        {!mdUp && (
          <Box px="16px" minHeight={148} display="flex" justifyContent="center" alignItems="center" className="bd-b">
            <UserBlockV2 account={account} login={login} logout={logout} className="ml-3" size="large" />
          </Box>
        )}
        <List component="nav" sx={{ px: '16px', py: { xs: '32px', md: '8px' } }}>
          {links.map((link) =>
            link.items ? <GroupMenuItem key={link.label} menu={link} /> : <MenuItem key={link.label} menu={link} />,
          )}
        </List>

        <Box p="16px">
          <CopyFinixAddress />

          <Button
            variant="outlined"
            href="https://bsc.definix.com/"
            target="_blank"
            fullWidth
            size="large"
            sx={{
              color: theme.palette.text.secondary,
              borderColor: `${theme.palette.grey[300]} !important`,
              background: 'transparent !important',
            }}
            className="flex align-center px-2 justify-start mt-3"
          >
            <img src={FinixCoin} alt="FinixCoin" width="16" />
            <Typography variant="body2" fontWeight="bold" className="px-2 mr-auto">
              Switch to G1
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default PanelBodyV2
