import axios from 'axios'
import _ from 'lodash'
import throttle from 'lodash/throttle'
import numeral from 'numeral'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import CountDownBanner from 'uikit-dev/components/CountDownBanner'
import StartTimeBanner from 'uikit-dev/components/StartTimeBanner'
import logoTrade from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-29.png'
import colorGradient from 'uikit-dev/images/for-ui-v2/color-gradient.png'
import definixCoin from 'uikit-dev/images/KR-Banner/AWforDefinix-03.png'
import Button from '../../components/Button/Button'
import Dropdown from '../../components/Dropdown/Dropdown'
import { Flex } from '../../components/Flex'
import Footer from '../../components/Footer'
import Overlay from '../../components/Overlay/Overlay'
import { SvgProps } from '../../components/Svg'
import ChevronDownIcon from '../../components/Svg/Icons/ChevronDown'
import Text from '../../components/Text/Text'
import { useMatchBreakpoints } from '../../hooks'
import en from '../../images/en.png'
import FinixCoin from '../../images/finix-coin.png'
import bsc from '../../images/Logo-BinanceSmartChain.png'
import klaytn from '../../images/Logo-Klaytn.png'
import th from '../../images/th.png'
import { MENU_HEIGHT } from './config'
import * as IconModule from './icons'
import Logo from './Logo'
import MenuButton from './MenuButton'
import Panel from './Panel'
import { NavProps } from './types'
import UserBlock from './UserBlock'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const StyledNav = styled.nav<{ showMenu: boolean }>`
  flex-shrink: 0;
  transition: top 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  position: relative;
  z-index: 20;
  height: ${MENU_HEIGHT}px;
  transform: translate3d(0, 0, 0);
  background: ${({ theme }) => theme.colors.backgroundHeader};

  &:before {
    content: '';
    width: 100%;
    height: 2px;
    background: #f90;
    position: absolute;
    bottom: 0;
    left: 0;
    background: url(${colorGradient});
    background-size: cover;
  }

  .network {
    // box-shadow: ${({ theme }) => theme.shadows.elevation1};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 24px;
  }
`

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  background: ${({ theme }) => theme.colors.backgroundSideMenu};

  ${({ theme }) => theme.mediaQueries.md} {
    min-height: calc(100% - 124px);
  }
`

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  transition: margin-top 0.2s;
  transform: translate3d(0, 0, 0);
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.backgroundSideMenu};

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 12px;
  }
`

const InnerBg = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.backgroundRadial};
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.inset3};

  ${({ theme }) => theme.mediaQueries.md} {
    border-top-left-radius: ${({ theme }) => theme.radii.medium};
    border-bottom-left-radius: ${({ theme }) => theme.radii.medium};
  }
`

const MobileOnlyOverlay = styled(Overlay)`
  position: fixed;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const Price = styled.a`
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
  setIsDark,
  langs,
  setLang,
  currentLang,
  finixPriceUsd,
  links,
  children,
  price,
}) => {
  const { isXl, isMd } = useMatchBreakpoints()
  const isMobile = !isMd && !isXl
  const [isPushed, setIsPushed] = useState(false)
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
  const endRegisterTimestamp = process.env.REACT_APP_TRADE_COMPETITION_TIMESTAMP
    ? parseInt(process.env.REACT_APP_TRADE_COMPETITION_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

  // started - ended countdown
  const currentTime = new Date().getTime()

  const endStatedTradingTime = process.env.REACT_APP_START_END_TRADE_COMPETITION_TIMESTAMP
    ? parseInt(process.env.REACT_APP_START_END_TRADE_COMPETITION_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

  const endTradingTimestamp = process.env.REACT_APP_END_TRADE_COMPETITION_TIMESTAMP
    ? parseInt(process.env.REACT_APP_END_TRADE_COMPETITION_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

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

  // API TRADING COMPET
  const [valuePnl, setValuePnl] = React.useState(0)
  useEffect(() => {
    async function fetchLeaderBoard() {
      const leaderBoardAPI = process.env.REACT_APP_API_LEADER_BOARD
      const response = await axios.get(`${leaderBoardAPI}`)
      if (response.data.success) {
        const pnl = _.get(response.data, 'data.0.pnl')
        setValuePnl(pnl.toFixed(2))
      }
    }
    fetchLeaderBoard()
  }, [valuePnl])

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
          {/* <StyledLogo as="a" href="/" aria-label="Definix home page">
            <img src={logoDesktop} alt="" />
          </StyledLogo> */}

          <Dropdown
            position="bottom"
            target={
              <Button
                variant="text"
                size="sm"
                startIcon={<img src={bsc} alt="" width="20px" className="mr-2" />}
                endIcon={<ChevronDownIcon className="ml-1" />}
                color="text"
                className="network px-2"
              >
                <Text fontSize="12px" fontWeight="500">
                  {isMobile ? 'BSC' : 'Binance Smart Chain'}
                </Text>
              </Button>
            }
          >
            <MenuButton
              variant="text"
              startIcon={<img src={bsc} alt="" width="20px" className="mr-2" />}
              className="color-primary mb-2"
            >
              Binance Smart Chain
            </MenuButton>
            <MenuButton
              variant="text"
              startIcon={<img src={klaytn} alt="" width="20px" className="mr-2" />}
              disabled
              className="color-disable"
              style={{ background: 'transparent' }}
            >
              Klaytn
            </MenuButton>
          </Dropdown>
        </Flex>

        <Flex alignItems="center">
          {!isMobile && (
            <Price href="https://dex.guru/token/0x0f02b1f5af54e04fb6dd6550f009ac2429c4e30d-bsc" target="_blank">
              <img src={FinixCoin} alt="" />
              <p>
                <span>FINIX : </span>
                <strong>${(price || 0) <= 0 ? 'N/A' : numeral(price).format('0,0.0000')}</strong>
              </p>
            </Price>
          )}
          <UserBlock account={account} login={login} logout={logout} />
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
          setIsDark={setIsDark}
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
          <InnerBg>
            <CountDownBanner
              logo={definixCoin}
              title="Ceritakan tentang pengalamanmu di Crypto"
              highlight="dan menangkan 20$"
              endTime=""
              button={
                <Button
                  as="a"
                  target="_blank"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeD1LOcZ9bIBrPrZGy3PV-pS9gF-ijg-aj3XyMEAluj7wCbBQ/viewform"
                  size="sm"
                >
                  Click
                </Button>
              }
              disableCountdown
            />

            <CountDownBanner
              logo={logoTrade}
              title="Definix Trading Tournament"
              detail="Registration Period end in"
              endTime={endRegisterTimestamp}
              button={
                <Button as="a" href="https://bsc.definix.com/trading-challenge" size="sm">
                  Register now
                </Button>
              }
            />

            {currentTime > endStatedTradingTime ? (
              <CountDownBanner
                logo={logoTrade}
                title="The 1st Definix Trading Tournament"
                detail="will end in"
                topTitle="Top trader gain profit"
                topValue={`${valuePnl}%`}
                endTime={endTradingTimestamp}
                button={
                  <Button as="a" href="https://bsc.definix.com/leaderboard" size="sm">
                    See more
                  </Button>
                }
              />
            ) : (
              <StartTimeBanner
                logo={logoTrade}
                title="The 1st Definix Trading Tournament"
                detail="has started"
                topTitle="Top trader gain profit"
                topValue={`${valuePnl}%`}
                endTime={endStatedTradingTime}
                button={
                  <Button as="a" href="https://bsc.definix.com/leaderboard" size="sm">
                    See more
                  </Button>
                }
              />
            )}
            <div style={{ width: '100%', flexGrow: 1 }}>{children}</div>
          </InnerBg>
        </Inner>
        <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" />
      </BodyWrapper>
      <Footer />
    </Wrapper>
  )
}

export default Menu
