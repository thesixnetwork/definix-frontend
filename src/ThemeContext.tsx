import React, { useState } from 'react'
import { DefaultTheme, ThemeProvider as SCThemeProvider } from 'styled-components'
import { light, dark } from '@fingerlabs/definixswap-uikit-v2';

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
      <SCThemeProvider theme={(isDark ? dark : light) as DefaultTheme}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
