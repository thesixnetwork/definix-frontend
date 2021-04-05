import throttle from 'lodash/throttle'
import numeral from 'numeral'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Button from '../../components/Button/Button'
import Text from '../../components/Text/Text'
import Dropdown from '../../components/Dropdown/Dropdown'
import { Flex } from '../../components/Flex'
import Footer from '../../components/Footer'
import Overlay from '../../components/Overlay/Overlay'
import { SvgProps } from '../../components/Svg'
import ChevronDownIcon from '../../components/Svg/Icons/ChevronDown'
import { useMatchBreakpoints } from '../../hooks'
import en from '../../images/en.png'
import FinixCoin from '../../images/finix-coin.png'
import bsc from '../../images/Logo-BinanceSmartChain.png'
import klaytn from '../../images/Logo-Klaytn.png'
import th from '../../images/th.png'
import { MENU_HEIGHT, SIDEBAR_WIDTH_FULL, SIDEBAR_WIDTH_REDUCED } from './config'
import * as IconModule from './icons'
import Logo from './Logo'
import MenuButton from './MenuButton'
import Panel from './Panel'
import { NavProps } from './types'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.2);

  ${({ theme }) => theme.mediaQueries.md} {
    min-height: calc(100vh - 48px);
  }

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
  }

  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background: rgba(255, 255, 255, 0.7);
  }
`

const StyledNav = styled.nav<{ showMenu: boolean }>`
  flex-shrink: 0;
  transition: top 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  width: 100%;
  z-index: 20;
  height: ${MENU_HEIGHT}px;
  background-color: ${({ theme }) => theme.nav.background};
  // border-bottom: solid 1px ${({ theme }) => theme.colors.border};
  transform: translate3d(0, 0, 0);
`

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  ${({ theme }) => theme.mediaQueries.md} {
    min-height: calc(100% - 124px);
  }
`

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  // margin-top: ${({ showMenu }) => (showMenu ? `${MENU_HEIGHT}px` : 0)};
  transition: margin-top 0.2s;
  transform: translate3d(0, 0, 0);
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  // ${({ theme }) => theme.mediaQueries.nav} {
  //   margin-left: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  //   max-width: ${({ isPushed }) => `calc(100% - ${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px)`};
  // }
`

const MobileOnlyOverlay = styled(Overlay)`
  position: fixed;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const Price = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  font-size: 0.5rem;

  img {
    width: 20px;
    margin-right: 8px;
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px;
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    p {
      font-size: 14px;
    }
  }
`

const Flag = styled.img`
  width: 24px;
  height: auto;
`

const Menu: React.FC<NavProps> = ({
  account,
  login,
  logout,
  isDark,
  toggleTheme,
  langs,
  setLang,
  currentLang,
  finixPriceUsd,
  links,
  children,
  price,
  // profile,
}) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = isXl === false
  const [isPushed, setIsPushed] = useState(!isMobile)
  const [showMenu, setShowMenu] = useState(true)
  const refPrevOffset = useRef(window.pageYOffset)
  const Icons = (IconModule as unknown) as { [key: string]: React.FC<SvgProps> }
  const { LanguageIcon } = Icons
  const IconFlag = () => {
    if (currentLang === 'en') {
      return <Flag src={en} alt="" />
    }

    if (currentLang === 'th') {
      return <Flag src={th} alt="" />
    }

    return <LanguageIcon color="textSubtle" width="24px" />
  }

  // const getLanguageName = (lang) => {
  //   return langs.find((l) => {
  //     return l.code === lang
  //   })?.language
  // }

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight
      const isTopOfPage = currentOffset === 0
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true)
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current) {
          // Has scroll up
          setShowMenu(true)
        } else {
          // Has scroll down
          setShowMenu(false)
        }
      }
      refPrevOffset.current = currentOffset
    }
    const throttledHandleScroll = throttle(handleScroll, 200)

    window.addEventListener('scroll', throttledHandleScroll)
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === 'Home')

  return (
    <Wrapper>
      <StyledNav showMenu={showMenu}>
        <Flex alignItems="center">
          <Logo
            isPushed={isPushed}
            togglePush={() => setIsPushed((prevState: boolean) => !prevState)}
            isDark={isDark}
            href={homeLink?.href ?? '/'}
          />
          {!isMobile && (
            <Dropdown
              position="bottom"
              target={
                <Button
                  variant="text"
                  size="sm"
                  startIcon={<img src={bsc} alt="" width="24" className="mr-2" />}
                  endIcon={<ChevronDownIcon className="ml-1" />}
                  className="ml-4 color-text"
                  style={{ marginTop: '4px' }}
                >
                  <Text fontSize="12px" fontWeight="500">
                    Binance Smart Chain
                  </Text>
                </Button>
              }
            >
              <MenuButton
                variant="text"
                startIcon={<img src={bsc} alt="" width="24" className="mr-2" />}
                className="color-primary mb-2"
              >
                Binance Smart Chain
              </MenuButton>
              <MenuButton
                variant="text"
                startIcon={<img src={klaytn} alt="" width="24" className="mr-2" />}
                disabled
                className="color-disable"
                style={{ background: 'transparent' }}
              >
                Klaytn
              </MenuButton>
            </Dropdown>
          )}
        </Flex>
        <Flex alignItems="center">
          <Price>
            <img src={FinixCoin} alt="" />
            <p>
              <span>FINIX : </span>
              <strong>${(price || 0) <= 0 ? 'N/A' : numeral(price).format('0,0.0000')}</strong>
            </p>
          </Price>
          {/* <Dropdown
            position="bottom-right"
            target={
              <Button
                variant="tertiary"
                size="sm"
                startIcon={<IconFlag />}
                endIcon={<ChevronDownIcon className="ml-1" />}
                style={{ borderRadius: '6px', padding: '0 8px 0 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.16)' }}
              >
              </Button>
            }
          >
            {langs.map((lang) => (
              <MenuButton
                key={lang.code}
                fullWidth
                onClick={() => setLang(lang)}
                style={{ minHeight: '32px', height: 'auto' }}
              >
                {lang.language}
              </MenuButton>
            ))}
          </Dropdown> */}
          {/* {profile && <Avatar profile={profile} />} */}
        </Flex>
      </StyledNav>
      <BodyWrapper>
        <Panel
          isPushed={isPushed}
          isMobile={isMobile}
          showMenu={showMenu}
          isDark={isDark}
          toggleTheme={toggleTheme}
          langs={langs}
          setLang={setLang}
          currentLang={currentLang}
          finixPriceUsd={finixPriceUsd}
          pushNav={setIsPushed}
          links={links}
          account={account}
          login={login}
          logout={logout}
        />
        <Inner isPushed={isPushed} showMenu={showMenu}>
          {children}
        </Inner>
        <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" />
      </BodyWrapper>
      <Footer />
    </Wrapper>
  )
}

export default Menu
