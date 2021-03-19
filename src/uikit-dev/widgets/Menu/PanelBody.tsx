import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Heading from '../../components/Heading/Heading'
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
`

const PanelBody: React.FC<Props> = (props) => {
  const location = useLocation()

  const { isPushed, pushNav, isMobile, links, account, login, logout } = props

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined

  return (
    <Container>
      <BorderBox>
        <Heading fontSize="14px" className="mb-4">
          Wallet
        </Heading>
        <UserBlock account={account} login={login} logout={logout} />
      </BorderBox>
      <BorderBox>
        <Heading fontSize="14px">DEX</Heading>
        {links.map((entry) => {
          const calloutClass = entry.calloutClass ? entry.calloutClass : undefined
          const isActive = entry.href === location.pathname

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
          return (
            <MenuEntry key={entry.label} isActive={isActive} className={calloutClass}>
              <MenuLink href={entry.href} onClick={handleClick}>
                <img src={isActive ? entry.iconActive : entry.icon} alt="" width="24" className="mr-3" />
                <LinkLabel isPushed={isPushed}>{entry.label}</LinkLabel>
              </MenuLink>
            </MenuEntry>
          )
        })}
      </BorderBox>
      {/* <BorderBox>
        <Heading fontSize="14px">Invest</Heading>
      </BorderBox> */}
    </Container>
  )
}

export default PanelBody
