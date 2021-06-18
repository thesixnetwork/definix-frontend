import useTheme from 'hooks/useTheme'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import SwitchNetwork from 'uikit-dev/components/SwitchNetwork'
import logoDesktop from '../../images/Definix-advance-crypto-assets.png'
import logoWhite from '../../images/definix-white-logo.png'
import { Login } from '../WalletModal/types'
import Accordion from './Accordion'
import { LinkLabel, MenuEntry } from './MenuEntry'
import MenuLink from './MenuLink'
import { PanelProps, PushedProps } from './types'
import UserBlock from './UserBlock'

interface Props extends PanelProps, PushedProps {
  isMobile: boolean
  account?: string
  login: Login
  logout: () => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  padding: 4px 12px 12px 12px;
`

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

const PanelBody: React.FC<Props> = (props) => {
  const location = useLocation()
  const { isDark } = useTheme()
  const { isPushed, pushNav, isMobile, links, account, login, logout } = props

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined

  const MenuItem = ({ menu }) => {
    const calloutClass = menu.calloutClass ? menu.calloutClass : undefined
    const isActive = location.pathname === menu.href && !menu.notHighlight

    if (menu.items) {
      const itemsMatchIndex = menu.items.findIndex((item) => item.href === location.pathname)
      const initialOpenState = menu.initialOpenState === true ? menu.initialOpenState : itemsMatchIndex >= 0

      return (
        <Accordion
          key={menu.label}
          isPushed={isPushed}
          pushNav={pushNav}
          icon={<img src={isDark ? menu.iconActive : menu.icon} alt="" width="24" className="mr-3" />}
          label={menu.label}
          initialOpenState={initialOpenState}
          className={calloutClass}
        >
          {isPushed &&
            menu.items.map((item) => (
              <MenuEntry
                key={item.label}
                isActive={item.href === location.pathname && !item.notHighlight}
                className={calloutClass}
                style={{ border: 'none' }}
              >
                <MenuLink
                  href={item.href}
                  onClick={handleClick}
                  target={item.newTab ? '_blank' : ''}
                  style={{ paddingLeft: '40px' }}
                >
                  <LinkLabel isPushed={isPushed}>{item.label}</LinkLabel>
                </MenuLink>
              </MenuEntry>
            ))}
        </Accordion>
      )
    }

    return (
      <MenuEntry key={menu.label} isActive={isActive} className={calloutClass}>
        <MenuLink href={menu.href} onClick={handleClick} target={menu.newTab ? '_blank' : ''}>
          <img src={isActive || isDark ? menu.iconActive : menu.icon} alt="" width="24" className="mr-3" />
          <LinkLabel isPushed={isPushed}>{menu.label}</LinkLabel>
        </MenuLink>
      </MenuEntry>
    )
  }

  return (
    <Container>
      {isMobile && (
        <div className="bd-b py-4">
          <StyledLink as="a" href="/" aria-label="Definix home page">
            <img src={isDark ? logoWhite : logoDesktop} alt="" />
          </StyledLink>

          <div className="flex align-center justify-space-between mt-2">
            <SwitchNetwork />
            <UserBlock account={account} login={login} logout={logout} className="dis-in-block" />
          </div>
        </div>
      )}

      {links.map((link) => (
        <div className="py-2 bd-b">
          <MenuItem menu={link} key={link.label} />
        </div>
      ))}

      {/* <BorderBox>
        <Heading fontSize="14px" className="mb-4">
          Wallet
        </Heading>

        {links
          .filter((link) => link.group === 'wallet')
          .map((link) => (
            <MenuItem menu={link} />
          ))}
      </BorderBox>
      <BorderBox>
        <Heading fontSize="14px">DEX</Heading>
        {links
          .filter((link) => link.group === 'dex')
          .map((link) => (
            <MenuItem menu={link} />
          ))}
      </BorderBox>
      <BorderBox>
        <Heading fontSize="14px">Trading Competition</Heading>
        {links
          .filter((link) => link.group === 'trading')
          .map((link) => (
            <MenuItem menu={link} />
          ))}
      </BorderBox>
      <BorderBox>
        <Heading fontSize="14px">Invest</Heading>
        {links
          .filter((link) => link.group === 'invest')
          .map((link) => (
            <MenuItem menu={link} />
          ))}
      </BorderBox>
      <BorderBox>
        <Heading fontSize="14px">Tool</Heading>
        {links
          .filter((link) => link.group === 'tool')
          .map((link) => (
            <MenuItem menu={link} />
          ))}
      </BorderBox>
      <BorderBox>
        <Heading fontSize="14px">Contact</Heading>
        {links
          .filter((link) => link.group === 'contact')
          .map((link) => (
            <MenuItem menu={link} />
          ))}
      </BorderBox> */}
    </Container>
  )
}

export default PanelBody
