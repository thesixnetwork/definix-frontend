import React, { useState } from 'react'
import { ThemeProvider as SCThemeProvider, DefaultTheme } from 'styled-components'
import { light, dark } from 'definixswap-uikit-v2'
// import oldLight from 'uikit-dev/theme/light'
// import oldDark from 'uikit-dev/theme/dark'

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
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SCThemeProvider theme={light}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
