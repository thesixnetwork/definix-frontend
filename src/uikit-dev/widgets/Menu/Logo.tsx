import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Flex from '../../components/Box/Flex'
import logoMobile from '../../images/64x64.png'
import logoDesktop from '../../images/Definix-advance-crypto-assets.png'
import { HamburgerCloseIcon, HamburgerIcon } from './icons'
import MenuButton from './MenuButton'

interface Props {
  isPushed: boolean
  isDark: boolean
  togglePush: () => void
  href: string
}

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  .mobile-icon {
    width: 32px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
  }
  .desktop-icon {
    width: 156px;
    display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
    }
  }
`

const Logo: React.FC<Props> = ({ isPushed, togglePush, href }) => {
  const isAbsoluteUrl = href.startsWith('http')
  const innerLogo = (
    <>
      <img src={logoMobile} alt="" className="mobile-icon" />
      <img src={logoDesktop} alt="" className="desktop-icon" />
    </>
  )

  return (
    <Flex>
      <MenuButton aria-label="Toggle menu" onClick={togglePush} mr="24px">
        {isPushed ? (
          <HamburgerCloseIcon width="24px" color="textSubtle" />
        ) : (
          <HamburgerIcon width="24px" color="textSubtle" />
        )}
      </MenuButton>
      {isAbsoluteUrl ? (
        <StyledLink as="a" href={href} aria-label="Pancake home page">
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink to={href} aria-label="Pancake home page">
          {innerLogo}
        </StyledLink>
      )}
    </Flex>
  )
}

export default Logo
