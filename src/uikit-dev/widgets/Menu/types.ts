import { Login } from '../WalletModal/types'

export interface LangType {
  code: string
  language: string
}

export interface Profile {
  username?: string
  image?: string
  profileLink: string
  noProfileLink: string
  showPip?: boolean
}

export interface PushedProps {
  isPushed: boolean
  pushNav: (isPushed: boolean) => void
}

export interface NavTheme {
  background: string
  hover: string
}

export interface MenuSubEntry {
  label: string
  href?: string
  calloutClass?: string
  initialOpenState?: boolean
  group?: string
  notHighlight?: boolean
  newTab?: boolean
}

export interface MenuEntry {
  label: string
  icon: any
  iconActive: any
  items?: MenuSubEntry[]
  href?: string
  group?: string
  calloutClass?: string
  initialOpenState?: boolean
  notHighlight?: boolean
  newTab?: boolean
}

export interface PanelProps {
  isDark: boolean
  setIsDark: (isDark: boolean) => void
  finixPriceUsd?: number
  currentLang: string
  langs: LangType[]
  setLang: (lang: LangType) => void
  links: Array<MenuEntry>
}

export interface NavProps extends PanelProps {
  account?: string
  login: Login
  profile?: Profile
  price?: number
  logout: () => void
  value?: number
}
