import React, { useState } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import light from 'uikit-dev/theme/light'
import dark from 'uikit-dev/theme/dark'

const CACHE_KEY = 'IS_DARK'

export interface ThemeContextType {
  isDark: boolean
  toggleTheme: (isDarkMode) => void
}

const ThemeContext = React.createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: (isDarkMode) => null,
})

const ThemeContextProvider: React.FC = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const isDarkUserSetting = localStorage.getItem(CACHE_KEY)
    return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false
  })

  const toggleTheme = (isDarkmode) => {
    setIsDark(() => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(isDarkmode))
      return isDarkmode
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SCThemeProvider theme={isDark ? dark : light}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
