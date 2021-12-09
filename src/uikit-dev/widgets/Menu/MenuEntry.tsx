import styled, { keyframes, DefaultTheme } from 'styled-components'
import { MENU_ENTRY_HEIGHT } from './config'

export interface Props {
  secondary?: boolean
  isActive?: boolean
  theme: DefaultTheme
}

const rainbowAnimation = keyframes`
  0%,
  100% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 0;
  }
`

const LinkLabel = styled.div<{ isPushed: boolean }>`
  color: inherit;
  transition: color 0.4s;
  flex-grow: 1;
`

const MenuEntry = styled.div<Props>`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: 0 16px;
  font-size: 14px;
  background-color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : 'transparent')};
  color: ${({ isActive, theme }) => (isActive ? theme.colors.white : theme.colors.text)};
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  border-radius: ${({ isActive, theme }) => (isActive ? theme.radii.small : 0)};

  &.new {
    img {
      width: 40px;
      margin: 0 12px 0 -8px !important;
    }
  }

  a {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
  }

  // Safari fix
  flex-shrink: 0;

  &.rainbow {
    -webkit-background-clip: text;
    animation: ${rainbowAnimation} 3s ease-in-out infinite;
    background-size: 400% 100%;
  }
`
MenuEntry.defaultProps = {
  secondary: false,
  isActive: false,
  role: 'button',
}

export { MenuEntry, LinkLabel }
