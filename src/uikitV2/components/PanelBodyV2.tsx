import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material'
import { Box, Collapse, Link as MuiLink, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import SwitchNetwork from 'uikit-dev/components/SwitchNetwork'
import { Text } from 'uikit-dev/components/Text'
import logoDesktop from 'uikit-dev/images/Definix-advance-crypto-assets.png'
import logoWhite from 'uikit-dev/images/definix-white-logo.png'
import FinixCoin from 'uikit-dev/images/finix-coin.png'
import Accordion from 'uikit-dev/widgets/Menu/Accordion'
import { LinkLabel, MenuEntry } from 'uikit-dev/widgets/Menu/MenuEntry'
import MenuLink from 'uikit-dev/widgets/Menu/MenuLink'
import { PanelProps, PushedProps } from 'uikit-dev/widgets/Menu/types'
import UserBlock from 'uikit-dev/widgets/Menu/UserBlock'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import { Login } from 'uikit-dev/widgets/WalletModal/types'
import definix from '../images/definix-full.svg'

// const OldMenu = ({ menu }) => {
//   const calloutClass = menu.calloutClass ? menu.calloutClass : undefined
//   const isActive = location.pathname === menu.href && !menu.notHighlight

//   if (menu.items) {
//     const itemsMatchIndex = menu.items.findIndex((item) => item.href === location.pathname)
//     const initialOpenState = menu.initialOpenState === true ? menu.initialOpenState : itemsMatchIndex >= 0

//     return (
//       <Accordion
//         key={menu.label}
//         isPushed={isPushed}
//         pushNav={pushNav}
//         icon={<img src={isDark ? menu.iconActive : menu.icon} alt="" width="24" className="mr-3" />}
//         label={menu.label}
//         initialOpenState={initialOpenState}
//         className={calloutClass}
//       >
//         {isPushed &&
//           menu.items.map((item) => (
//             <MenuEntry
//               key={item.label}
//               isActive={item.href === location.pathname && !item.notHighlight}
//               className={calloutClass}
//               style={{ border: 'none' }}
//             >
//               <MenuLink
//                 href={item.customHref ? (item.customHref || {})[(currentLang || '').toLowerCase()] : item.href}
//                 onClick={handleClick}
//                 target={item.newTab ? '_blank' : ''}
//                 style={{ paddingLeft: '40px' }}
//               >
//                 <LinkLabel isPushed={isPushed}>{item.label}</LinkLabel>
//               </MenuLink>
//             </MenuEntry>
//           ))}
//       </Accordion>
//     )
//   }

//   return (
//     <MenuEntry key={menu.label} isActive={isActive} className={calloutClass}>
//       <MenuLink href={menu.href} onClick={handleClick} target={menu.newTab ? '_blank' : ''}>
//         <img src={isActive || isDark ? menu.iconActive : menu.icon} alt="" width="24" className="mr-3" />
//         <LinkLabel isPushed={isPushed}>{menu.label}</LinkLabel>
//       </MenuLink>
//     </MenuEntry>
//   )
// }

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

const MenuItem = ({ menu, currentLang }) => {
  const location = useLocation()
  const isActive = location.pathname === menu.href && !menu.notHighlight

  return (
    <ListItemButton
      selected={isActive}
      to={menu.customHref ? (menu.customHref || {})[(currentLang || '').toLowerCase()] : menu.href}
      component={Link}
    >
      <ListItemIcon>
        <img src={menu.icon} alt="" width="24" />
      </ListItemIcon>
      <ListItemText primary={menu.label} />
    </ListItemButton>
  )
}

const GroupMenuItem = ({ menu, currentLang }) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isActive = location.pathname === menu.href && !menu.notHighlight

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
              selected={location.pathname === m.href && !m.notHighlight}
              to={m.customHref ? (m.customHref || {})[(currentLang || '').toLowerCase()] : m.href}
              component={Link}
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
  const { isMobile, links, account, login, logout, currentLang } = props

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
            link.items ? (
              <GroupMenuItem key={link.label} menu={link} currentLang={currentLang} />
            ) : (
              <MenuItem key={link.label} menu={link} currentLang={currentLang} />
            ),
          )}
        </List>
      </Box>
    </Box>
  )
}

export default PanelBodyV2
