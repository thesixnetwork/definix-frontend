/* eslint-disable jsx-a11y/click-events-have-key-events */
import axios from 'axios'
import _ from 'lodash'
import throttle from 'lodash/throttle'
import numeral from 'numeral'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import DisclaimersModal from 'views/Explore/components/DisclaimersModal'
import BannerEllipsis from '../../components/BannerEllipsis'
import Button from '../../components/Button/Button'
import CountDownBanner from '../../components/CountDownBanner'
import { Flex } from '../../components/Flex'
import Footer from '../../components/Footer'
import Overlay from '../../components/Overlay/Overlay'
import StartTimeBanner from '../../components/StartTimeBanner'
import SwitchNetwork from '../../components/SwitchNetwork'
import { Text } from '../../components/Text'
import { useMatchBreakpoints } from '../../hooks'
import FinixCoin from '../../images/finix-coin.png'
import logoTrade from '../../images/for-trading-challenge/Definix-Trading-Challenge-29.png'
import colorGradient from '../../images/for-ui-v2/color-gradient.png'
import logoNoti from '../../images/for-ui-v2/noti.png'
import useModal from '../Modal/useModal'
import { MENU_HEIGHT } from './config'
import Logo from './Logo'
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
}) => {
  const location = useLocation()
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isMd && !isXl && !isLg
  const [isPushed, setIsPushed] = useState(false)
  const [showMenu, setShowMenu] = useState(true)
  const refPrevOffset = useRef(window.pageYOffset)
  const [onPresentDisclaimersModal] = useModal(<DisclaimersModal />)
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
          {!isMobile && <SwitchNetwork />}
        </Flex>

        <Flex alignItems="center">
          <Price href="https://klaytn.loremboard.finance/chart/FINIX" target="_blank">
            <img src={FinixCoin} alt="" />
            <p>
              <span>FINIX : </span>
              <strong>${(price || 0) <= 0 ? 'N/A' : numeral(price).format('0,0.0000')}</strong>
            </p>
          </Price>

          {!isMobile && <UserBlock account={account} login={login} logout={logout} className="ml-3" />}
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
          <InnerBg>
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

            {location.pathname === '/rebalancing' ||
            location.pathname === '/rebalancing/detail' ||
            location.pathname === '/rebalancing/invest' ||
            location.pathname === '/rebalancing/withdraw' ? (
              <>
                {isMobile ? (
                  <BannerEllipsis />
                ) : (
                  <CountDownBanner
                    logo={logoNoti}
                    customText={
                      <>
                        <Text color="white" fontSize="13px">
                          <strong>Rebalancing Farm :</strong>{' '}
                          <span className="mr-1">
                            Rebalancing farm is a special farm that implements rebalancing strategy. The advantage of
                            the strategy is that it can help you minimize risk and get favored positions for your
                            investment in the long run.
                          </span>
                          <strong className="mr-1">About the disclosures of the rebalancing farm, you can</strong>
                          <span
                            role="none"
                            style={{
                              color: '#ffd157',
                              fontWeight: 'bold',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            onClick={onPresentDisclaimersModal}
                          >
                            read more here.
                          </span>
                          <span style={{ fontSize: '11px', display: 'block', opacity: '0.7' }}>
                            Definix is solely a marketplace which provides a tool. The rebalancing farm has been managed
                            by a 3rd party called Enigma.
                          </span>
                        </Text>
                      </>
                    }
                    disableCountdown
                  />
                )}
              </>
            ) : (
              <></>
              // <CountDownBanner
              //   logo={FinixCoin}
              //   title="FINIX-Klaytn Address : "
              //   detail="0xd51c337147c8033a43f3b5ce0023382320c113aa"
              //   disableCountdown
              //   button={
              //     <CopyToClipboard
              //       color="warning"
              //       noText
              //       toCopy="0xd51c337147c8033a43f3b5ce0023382320c113aa"
              //       tooltipPos="right"
              //     />
              //   }
              // />
            )}

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
        <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" zIndex={21} />
      </BodyWrapper>
      <Footer />
    </Wrapper>
  )
}

export default Menu
