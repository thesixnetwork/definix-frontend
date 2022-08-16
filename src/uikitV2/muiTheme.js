/* eslint-disable import/no-mutable-exports */
import { ExpandMoreRounded } from '@mui/icons-material'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

let muiTheme = createTheme({
  typography: {
    fontFamily: ['Roboto', 'Noto Sans KR', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#ff5532',
    },
    secondary: {
      main: '#5e515f',
    },
    text: {
      primary: '#222222',
      secondary: '#666666',
      tertiary: '#999999',
    },
    divider: 'rgba(224, 224, 224, 0.5)',
    bsc: '#fcbd1b',
    klaytn: '#5e515f',
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 'initial !important',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: { textTransform: 'initial', borderRadius: '8px', fontWeight: 'bold' },
        sizeSmall: {
          height: '32px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          fontSize: '0.875rem',
          minHeight: '40px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          padding: '8px',
          marginBottom: '8px',
          borderRadius: '8px',
          color: '#666666',
          transition: '0.1s',
          minHeight: '40px',

          '&.Mui-selected': {
            background: '#ff5532 !important',
            color: 'white',

            '.MuiListItemIcon-root': {
              filter: 'brightness(0) invert(1)',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: '24px', marginRight: '8px', color: 'inherit' },
      },
    },
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          fontSize: '0.875rem',
          color: 'inherit',
        },
      },
      styleOverrides: {
        root: {
          margin: '0',

          '& + svg': { color: 'inherit', width: '20px', height: '20px', opacity: '0.6' },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: ExpandMoreRounded,
      },
      styleOverrides: {
        root: {
          borderRadius: '8px',

          fieldset: {
            borderWidth: '1px !important',
            borderColor: '#e0e0e0 !important',
          },

          svg: {
            width: '20px',
            height: '20px',
            opacity: '0.6',
            top: 'calc(50% - 10px)',
          },
        },
        select: {
          color: '#666666',
          display: 'flex',
          alignItems: 'center',
          background: 'white',
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        elevation: 3,
      },
      styleOverrides: {
        paper: {
          border: '1px solid #e0e0e0',
          borderRadius: '8px !important',

          '.MuiList-root': {
            padding: '0',
          },

          '.MuiMenuItem-root': {
            minHeight: '40px',
            color: '#666666',

            p: {
              fontWeight: 'normal',
            },

            '&:hover': {
              background: 'rgba(0, 0, 0, 0.04) !important',
            },

            '&.Mui-selected': {
              background: 'transparent',

              p: {
                fontWeight: 'bold',
              },
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#5e515f',
        },
      },
    },
  },
})

muiTheme = responsiveFontSizes(muiTheme)

export default muiTheme
