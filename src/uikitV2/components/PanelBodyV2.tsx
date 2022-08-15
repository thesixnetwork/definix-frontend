import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material'
import { Box, Collapse, Link as MuiLink, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import SwitchNetwork from 'uikit-dev/components/SwitchNetwork'
import logoDesktop from 'uikit-dev/images/Definix-advance-crypto-assets.png'
import logoWhite from 'uikit-dev/images/definix-white-logo.png'
import { PanelProps, PushedProps } from 'uikit-dev/widgets/Menu/types'
import UserBlock from 'uikit-dev/widgets/Menu/UserBlock'
import { Login } from 'uikit-dev/widgets/WalletModal/types'
import definix from '../images/definix-full.svg'

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
  const { isDark } = useTheme()
  const { isMobile, links, account, login, logout } = props

  return (
    <Box display="flex" flexDirection="column">
      <Box py="30px" display="flex" justifyContent="center" alignItems="center" flexShrink={0}>
        <MuiLink href="/">
          <img src={definix} alt="Definix" />
        </MuiLink>
      </Box>

      <Box px={2}>
        {isMobile && (
          <div className="bd-b py-4">
            <StyledLink as="a" href="/" aria-label="Definix home page">
              <img src={isDark ? logoWhite : logoDesktop} alt="" />
            </StyledLink>

            <SwitchNetwork />
            <UserBlock account={account} login={login} logout={logout} className="mt-2 dis-in-block" />
          </div>
        )}

        <List component="nav">
          {links.map((link) =>
            link.items ? <GroupMenuItem key={link.label} menu={link} /> : <MenuItem key={link.label} menu={link} />,
          )}
        </List>
      </Box>
    </Box>
  )
}

export default PanelBodyV2
