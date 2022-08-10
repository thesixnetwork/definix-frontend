import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import React, { useState } from 'react'
import muiTheme from 'style/muiTheme'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import dark from 'uikit-dev/theme/dark'
import light from 'uikit-dev/theme/light'

const CACHE_KEY = 'IS_DARK'

const ThemeContext = React.createContext({
  isDark: null,
  toggleTheme: (isDarkMode) => {
    return isDarkMode
  },
})

const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const isDarkUserSetting = localStorage.getItem(CACHE_KEY)
    return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false
  })

  const toggleTheme = (isDarkMode) => {
    setIsDark(() => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(isDarkMode))
      return isDarkMode
    })
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <SCThemeProvider theme={isDark ? dark : light}>{children}</SCThemeProvider>
      </ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export { ThemeContext, ThemeContextProvider }
