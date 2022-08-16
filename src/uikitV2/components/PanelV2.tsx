import { Box, Drawer } from '@mui/material'
import React from 'react'
import { PanelProps, PushedProps } from 'uikit-dev/widgets/Menu/types'
import { Login } from 'uikit-dev/widgets/WalletModal/types'
import PanelBodyV2 from './PanelBodyV2'
import PanelFooterV2 from './PanelFooterV2'

interface Props extends PanelProps, PushedProps {
  showMenu: boolean
  setShowMenu: (boolean) => void
  isMobile: boolean
  account?: string
  login: Login
  logout: () => void
  window?: any
  drawerWidth: number
}

const PanelV2: React.FC<Props> = ({ drawerWidth, showMenu, setShowMenu, ...props }) => {
  const onClose = () => {
    setShowMenu(false)
  }

  const content = (
    <>
      <PanelBodyV2 {...props} />
      <PanelFooterV2 {...props} />
    </>
  )

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={showMenu}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {content}
      </Drawer>
    </Box>
  )
}

export default PanelV2
