import { Box, BoxProps, Button, styled, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { memo } from 'react'
import bsc from '../images/bsc.png'
import klaytn from '../images/klaytn.png'

interface CustomBoxProps {
  isBsc?: boolean
  theme: Theme
}

const SwitchStyle = styled(Box)(({ theme, isBsc = true }: CustomBoxProps & BoxProps) => ({
  display: `flex`,
  alignItems: `center`,
  background: `white`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: `32px`,
  height: `32px`,

  button: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    textTransform: `initial`,
    paddingLeft: `10px`,
    paddingRight: `16px`,
    height: `calc(100% + 2px)`,
    borderRadius: `32px`,
    position: 'relative',

    '&:first-child': {
      left: '-1px',
      background: `${isBsc ? '#fcbd1b' : 'transparent'}`,
      color: `${isBsc ? 'white' : theme.palette.text.secondary}`,
    },

    '&:last-child': {
      right: '-1px',
      background: `${!isBsc ? '#5e515f' : 'transparent'}`,
      color: `${!isBsc ? 'white' : theme.palette.text.secondary}`,
    },
  },

  img: {
    width: `16px`,
    height: `16px`,
  },

  p: {
    flexShrink: `0`,
    marginLeft: `8px`,
    fontSize: `0.75rem`,
    fontWeight: `bold`,
  },
}))

const SwitchNetworkV2 = () => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <SwitchStyle>
      <Button size="small">
        <img src={bsc} alt="" width="20px" />
        <Typography variant="body2">{lgUp ? 'Binance Smart Chain' : 'BSC'} </Typography>
      </Button>
      <Button
        size="small"
        onClick={() => {
          window.location.href = 'https://g2.klaytn.definix.com/'
        }}
      >
        <img src={klaytn} alt="" width="20px" />
        <Typography variant="body2">Klaytn Chain</Typography>
      </Button>
    </SwitchStyle>
  )
}
export default memo(SwitchNetworkV2)
