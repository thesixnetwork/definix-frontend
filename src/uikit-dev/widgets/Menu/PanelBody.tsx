import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Heading from '../../components/Heading/Heading'
import certik from '../../images/Audit/AW-42.png'
import techRate from '../../images/Audit/AW-43.png'
import { Login } from '../WalletModal/types'
import { LinkLabel, MenuEntry } from './MenuEntry'
import MenuLink from './MenuLink'
import { PanelProps, PushedProps } from './types'
import UserBlock from './UserBlock'
// import Accordion from './Accordion'

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
`

const BorderBox = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
  padding: 1.5rem 0;

  &:last-child {
    border: none;
  }

  > h2 {
    font-size: 12px !important;
    padding: 0 1.5rem;
    margin-bottom: 0.5rem;
  }

  [role='button'] {
    padding: 0 1.75rem;
  }

  .connect-btn {
    background: transparent;
    overflow: hidden;
    width: 190px;
  }
`

const PanelBody: React.FC<Props> = (props) => {
  const location = useLocation()

  const { isPushed, pushNav, isMobile, links, account, login, logout } = props

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined

  const MenuItem = ({ menu }) => {
    // if (entry.items) {
    //   const itemsMatchIndex = entry.items.findIndex((item) => item.href === location.pathname)
    //   const initialOpenState = entry.initialOpenState === true ? entry.initialOpenState : itemsMatchIndex >= 0

    //   return (
    //     <Accordion
    //       key={entry.label}
    //       isPushed={isPushed}
    //       pushNav={pushNav}
    //       icon={iconElement}
    //       label={entry.label}
    //       initialOpenState={initialOpenState}
    //       className={calloutClass}
    //     >
    //       {isPushed &&
    //         entry.items.map((item) => (
    //           <MenuEntry key={item.href} secondary isActive={item.href === location.pathname} onClick={handleClick}>
    //             <MenuLink href={item.href}>{item.label}</MenuLink>
    //           </MenuEntry>
    //         ))}
    //     </Accordion>
    //   )
    // }

    const calloutClass = menu.calloutClass ? menu.calloutClass : undefined
    const isActive = location.pathname.includes(menu.href) && !menu.notHighlight

    return (
      <MenuEntry key={menu.label} isActive={isActive} className={calloutClass}>
        <MenuLink href={menu.href} onClick={handleClick}>
          <img src={isActive ? menu.iconActive : menu.icon} alt="" width="24" className="mr-3" />
          <LinkLabel isPushed={isPushed}>{menu.label}</LinkLabel>
        </MenuLink>
      </MenuEntry>
    )
  }

  return (
    <Container>
      <BorderBox>
        <Heading fontSize="14px" className="mb-4">
          Wallet
        </Heading>
        <UserBlock account={account} login={login} logout={logout} />

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
          <a
            className="mr-3"
            href="https://github.com/thesixnetwork/definix-audit/tree/main/Certik"
            target="_blank"
            rel="noreferrer"
          >
            <img src={certik} width="90" alt="" />
          </a>
          <a href="https://github.com/thesixnetwork/definix-audit/tree/main/Techrate" target="_blank" rel="noreferrer">
            <img src={techRate} width="80" alt="" />
          </a>
        </div>
      </BorderBox>
    </Container>
  )
}

export default PanelBody
