/* eslint-disable import/no-mutable-exports */
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

let muiTheme = createTheme({
  palette: {
    primary: {
      main: '#ff5532',
    },
    secondary: {
      main: '#5e515f',
    },
  },
})

muiTheme = responsiveFontSizes(muiTheme)

export default muiTheme
