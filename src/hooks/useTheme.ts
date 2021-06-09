import { useContext } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { ThemeContext } from 'contexts/ThemeContext'

const useTheme = () => {
  const { isDark, setIsDark, toggleTheme } = useContext(ThemeContext)
  const theme = useContext(StyledThemeContext)
  return { isDark, setIsDark, toggleTheme, theme }
}

export default useTheme
