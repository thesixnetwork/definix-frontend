import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, IconButton, Link, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import numeral from 'numeral'
import React from 'react'
import FinixCoin from 'uikit-dev/images/finix-coin.png'
import definix from 'uikitV2/images/definix.svg'
import SwitchNetworkV2 from './SwitchNetworkV2'
import UserBlockV2 from './UserBlockV2'

const ElevationScroll = (props) => {
  const { children, window } = props

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  })

  return React.cloneElement(children, {
    sx: trigger
      ? { ...children.props.sx, background: 'white', borderColor: (theme) => `${theme.palette.divider} !important` }
      : { ...children.props.sx, background: 'transparent', borderColor: 'transparent' },
  })
}

const HeaderV2 = (props) => {
  const { drawerWidth, price, account, login, logout, showMenu, setShowMenu } = props
  const theme = useTheme()
  const mdUp = useMediaQuery(theme.breakpoints.up('md'))

  const handleDrawerToggle = () => {
    setShowMenu(!showMenu)
  }

  return (
    <ElevationScroll {...props}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: '1px solid transparent' },
          transition: '0.2s',
        }}
      >
        <Toolbar
          className="flex justify-space-between"
          sx={{
            height: { xs: '56px', md: '80px' },
            padding: { xs: '0 1rem', md: '0 3.75rem' },
          }}
        >
          <Box alignItems="center" display="flex">
            {mdUp ? (
              <SwitchNetworkV2 />
            ) : (
              <>
                <IconButton onClick={handleDrawerToggle} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
                <Link href="/">
                  <img src={definix} alt="Definix" />
                </Link>
              </>
            )}
          </Box>

          <Box alignItems="center" display="flex">
            <Link
              href="https://swap.arken.finance/tokens/bsc/0x0f02b1f5af54e04fb6dd6550f009ac2429c4e30d?res=15"
              target="_blank"
              underline="none"
              color="#000"
              className="flex align-center"
            >
              <img src={FinixCoin} alt="" width={18} height={18} className="mr-1" />
              <Typography variant="body2" fontWeight={700}>
                ${(price || 0) <= 0 ? 'N/A' : numeral(price).format('0,0.0000')}
              </Typography>
            </Link>

            {mdUp && <UserBlockV2 account={account} login={login} logout={logout} className="ml-3" />}
          </Box>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  )
}

export default HeaderV2
