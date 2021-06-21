import useTheme from 'hooks/useTheme'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev/hooks'
import Flex from '../../components/Box/Flex'
import logoDesktop from '../../images/Definix-advance-crypto-assets.png'
import logoWhite from '../../images/definix-white-logo.png'
import { HamburgerIcon } from './icons'
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
  flex-shrink: 0;
  justify-content: center;
  margin-top: -4px;

  img {
    height: 14px;
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    img {
      height: 24px;
    }
  }
`

const StyledTogglePanel = styled(MenuButton)`
  padding: 0;
  background: transparent !important;
  margin-right: 16px;
`

const Logo: React.FC<Props> = ({ togglePush, href }) => {
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl && !isLg
  const { isDark } = useTheme()

  return (
    <Flex alignItems="center" className="mr-5">
      {isMobileOrTablet && (
        <StyledTogglePanel aria-label="Toggle menu" onClick={togglePush}>
          <HamburgerIcon width="24px" color="textSubtle" />
        </StyledTogglePanel>
      )}

      <StyledLink as="a" href={href} aria-label="Definix home page">
        <img src={isDark ? logoWhite : logoDesktop} alt="" />
      </StyledLink>
    </Flex>
  )
}

export default Logo
