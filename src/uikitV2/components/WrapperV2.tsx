/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Box, styled, Toolbar } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import axios from 'axios'
import _ from 'lodash'
import throttle from 'lodash/throttle'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BannerEllipsis from 'uikit-dev/components/BannerEllipsis'
import Button from 'uikit-dev/components/Button/Button'
import CountDownBanner from 'uikit-dev/components/CountDownBanner'
import Footer from 'uikit-dev/components/Footer'
import Overlay from 'uikit-dev/components/Overlay/Overlay'
import StartTimeBanner from 'uikit-dev/components/StartTimeBanner'
import { Text } from 'uikit-dev/components/Text'
import { useMatchBreakpoints } from 'uikit-dev/hooks'
import logoTrade from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-29.png'
import logoNoti from 'uikit-dev/images/for-ui-v2/noti.png'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import muiTheme from 'uikitV2/muiTheme'
import DisclaimersModal from 'views/Explore/components/DisclaimersModal'
import HeaderV2 from './HeaderV2'
import PanelV2 from './PanelV2'

const WrapperStyle = styled(Box)`
  position: relative;
  min-height: 100vh;
  display: flex;
`

const InnerBg = styled(Box)`
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MobileOnlyOverlay = styled(Overlay)`
  position: fixed;
  height: 100%;
`

const Price = styled('a')`
  display: flex;
  align-items: center;
  font-size: 0.5rem;

  img {
    width: 20px;
    margin-right: 8px;
  }
`

const WrapperV2 = ({
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

  const drawerWidth = 200

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
    <MuiThemeProvider theme={muiTheme}>
      <WrapperStyle>
        <HeaderV2
          account={account}
          login={login}
          logout={logout}
          price={price}
          drawerWidth={drawerWidth}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />
        <PanelV2
          isPushed={isPushed}
          isMobile={isMobile}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
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
          drawerWidth={drawerWidth}
        />
        <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
          <Toolbar sx={{ height: { xs: '56px', md: '80px' } }} />
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
              (location.pathname === '/rebalancing/withdraw' && (
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
                              Definix is solely a marketplace which provides a tool. The rebalancing farm has been
                              managed by a 3rd party called Enigma.
                            </span>
                          </Text>
                        </>
                      }
                      disableCountdown
                    />
                  )}
                </>
              ))}

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

          <Footer />

          <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" zIndex={21} />
        </Box>
      </WrapperStyle>
    </MuiThemeProvider>
  )
}

export default WrapperV2
