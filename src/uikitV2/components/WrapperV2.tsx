/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Box, styled, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import FooterV2 from './FooterV2'
import HeaderV2 from './HeaderV2'
import InnerLayout from './InnerLayout'
import PanelV2 from './PanelV2'

const WrapperStyle = styled(Box)`
  position: relative;
  min-height: 100vh;
  display: flex;
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
  const theme = useTheme()
  const mdUp = useMediaQuery(theme.breakpoints.up('md'))
  const drawerWidth = 200

  const [showMenu, setShowMenu] = useState(mdUp)

  return (
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
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        isDark={isDark}
        toggleTheme={toggleTheme}
        langs={langs}
        setLang={setLang}
        currentLang={currentLang}
        finixPriceUsd={finixPriceUsd}
        links={links}
        account={account}
        login={login}
        logout={logout}
        drawerWidth={drawerWidth}
      />

      <Box
        component="main"
        className="flex flex-column flex-grow"
        sx={{ width: { xs: '100vw', sm: `calc(100% - ${drawerWidth}px)` }, background: '#ffedcb' }}
      >
        <InnerLayout>{children}</InnerLayout>

        <FooterV2 />
      </Box>
    </WrapperStyle>
  )
}

export default WrapperV2
