import { styled, Switch } from '@mui/material'
import React from 'react'

const CustomSwitchStyle = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 56,
  height: 28,
  padding: 0,
  margin: '0 8px',

  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 4,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(28px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
    boxShadow: 'none',
  },
  '& .MuiSwitch-track': {
    borderRadius: 28 / 2,
    backgroundColor: '#dad0c5',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}))

const CustomSwitch = (props) => {
  return <CustomSwitchStyle {...props} />
}

export default CustomSwitch
