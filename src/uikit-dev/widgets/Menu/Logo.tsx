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

  img {
    height: 14px;
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    img {
      height: 20px;
    }
  }
`

const StyledTogglePanel = styled(MenuButton)`
  padding: 0;
  background: transparent !important;

  svg {
    fill: ${({ theme }) => theme.colors.text} !important;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const Logo: React.FC<Props> = ({ isPushed, togglePush, href }) => {
  const isAbsoluteUrl = href.startsWith('http')
  const innerLogo = (
    <>
      <img src={logoMobile} alt="" className="mobile-icon" />
    </>
  )

  return (
    <Flex alignItems="center">
      <StyledTogglePanel aria-label="Toggle menu" onClick={togglePush} mr="16px">
        <HamburgerIcon width="24px" color="textSubtle" />
      </StyledTogglePanel>
      <StyledLink as="a" href={href} aria-label="Definix home page">
        <img src={logoDesktop} alt="" />
      </StyledLink>
    </Flex>
  )
}

export default Logo
