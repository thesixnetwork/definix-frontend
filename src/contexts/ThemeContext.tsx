import React, { useState } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { dark, light } from 'uikit-dev'

const CACHE_KEY = 'IS_DARK'

const ThemeContext = React.createContext({ isDark: null, toggleTheme: (isDarkMode) => null })

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
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SCThemeProvider theme={isDark ? dark : light}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
