import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Login } from '../WalletModal/types'
import Accordion from './Accordion'
import { LinkLabel, MenuEntry } from './MenuEntry'
import MenuLink from './MenuLink'
import { PanelProps, PushedProps } from './types'

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
  padding: 12px;
`

const PanelBody: React.FC<Props> = (props) => {
  const location = useLocation()

  const { isPushed, pushNav, isMobile, links } = props

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
          icon={<img src={menu.icon} alt="" width="24" className="mr-3" />}
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
          <img src={isActive ? menu.iconActive : menu.icon} alt="" width="24" className="mr-3" />
          <LinkLabel isPushed={isPushed}>{menu.label}</LinkLabel>
        </MenuLink>
      </MenuEntry>
    )
  }

  return (
    <Container>
      {links.map((link) => (
        <MenuItem menu={link} key={link.label} />
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
        <Heading fontSize="14px">Certified by</Heading>
        <div className="flex flex-wrap align-center px-4 pt-2">
          <a className="mr-3" href="https://www.certik.org/projects/sixnetwork" target="_blank" rel="noreferrer">
            <img src={certik} width="80" alt="" />
          </a>
          <a href="https://github.com/thesixnetwork/definix-audit/tree/main/Techrate" target="_blank" rel="noreferrer">
            <img src={techRate} width="70" alt="" />
          </a>
        </div>
      </BorderBox>
      <BorderBox>
        <Heading fontSize="14px">Info</Heading>
        {links
          .filter((link) => link.group === 'info')
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
