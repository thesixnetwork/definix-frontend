import useTheme from 'hooks/useTheme'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import SwitchNetwork from 'uikit-dev/components/SwitchNetwork'
import { Text } from '../../components/Text'
import logoDesktop from '../../images/Definix-advance-crypto-assets.png'
import logoWhite from '../../images/definix-white-logo.png'
import { Login } from '../WalletModal/types'
import Accordion from './Accordion'
import { LinkLabel, MenuEntry } from './MenuEntry'
import MenuLink from './MenuLink'
import { PanelProps, PushedProps } from './types'
import UserBlock from './UserBlock'
import FinixCoin from '../../images/finix-coin.png'
import g2kr from '../../images/g2-kr.png'
import g2en from '../../images/g2-en.png'
import CopyToClipboard from '../WalletModal/CopyToClipboard'
import RankMenuCard from './RankMenuCard'

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
const StyleLight = styled.div`
  border: 2px solid #ececec;
  border-radius: 10px;
  padding: 6px;
  margin: 20px 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
`
const StyledDark = styled.div`
  border: 2px solid #57575b;
  border-radius: 10px;
  padding: 6px;
  margin: 20px 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
`
const PanelBody: React.FC<Props> = (props) => {
  const location = useLocation()
  const { isDark } = useTheme()
  const { isPushed, pushNav, isMobile, links, account, login, logout, currentLang } = props

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
                  href={item.customHref ? (item.customHref || {})[(currentLang || '').toLowerCase()] : item.href}
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
  const addressFinix = '0xd51c337147c8033a43f3b5ce0023382320c113aa'
  const addressEllipsis = addressFinix
    ? `${addressFinix.substring(0, 6)}...${addressFinix.substring(addressFinix.length - 4)}`
    : null
  return (
    <Container>
      {isMobile && (
        <div className="bd-b py-4">
          <StyledLink as="a" href="/" aria-label="Definix home page">
            <img src={isDark ? logoWhite : logoDesktop} alt="" />
          </StyledLink>

          <SwitchNetwork />
          <UserBlock account={account} login={login} logout={logout} className="mt-2 dis-in-block" />
        </div>
      )}
      <div className="py-2 bd-b">
        <RankMenuCard />
      </div>
      {links.map((link) => (
        <div className="py-2 bd-b">
          <MenuItem menu={link} key={link.label} />
        </div>
      ))}

      {isDark ? (
        <StyledDark>
          <img src={FinixCoin} alt="FinixCoin" width="24" />
          <Text className="pl-1" color="text" fontSize="14px">
            FINIX
          </Text>
          <Text className="px-2" fontSize="14px">
            {addressEllipsis}
          </Text>
          <CopyToClipboard color="#FFF" noText toCopy={addressFinix} tooltipPos="bottom" iconWidth="16px" />
        </StyledDark>
      ) : (
        <StyleLight>
          <img src={FinixCoin} alt="FinixCoin" width="24" />
          <Text className="pl-1" color="text" fontSize="14px">
            FINIX
          </Text>
          <Text className="px-2" fontSize="14px">
            {addressEllipsis}
          </Text>
          <CopyToClipboard color="#000" noText toCopy={addressFinix} tooltipPos="bottom" iconWidth="16px" />
        </StyleLight>
      )}

      <a href="http://google.com" target="_blank" rel="noopener noreferrer" className="mx-2">
        <img src={g2en} alt="" />
      </a>
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
