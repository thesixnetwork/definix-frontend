export type Breakpoints = string[]

export type MediaQueries = {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  nav: string
}

export type Spacing = number[]

export type Radii = {
  small: string
  default: string
  card: string
  circle: string
}

export type Shadows = {
  level1: string
  active: string
  success: string
  warning: string
  focus: string
  inset: string
  elevation1: string
  elevation2: string
}

export type Gradients = {
  bubblegum: string
}

export type Colors = {
  primary: string
  primaryBright: string
  primaryDark: string
  secondary: string
  tertiary: string
  success: string
  failure: string
  warning: string
  contrast: string
  invertedContrast: string
  input: string
  background: string
  backgroundDisabled: string
  backgroundBox: string
  text: string
  textDisabled: string
  textSubtle: string
  borderColor: string
  card: string
  border: string
  white: string
  placeholder: string
  harvest: string

  // Gradients
  gradients: Gradients

  // Brand colors
  binance: string
}

export type ZIndices = {
  dropdown: number
  modal: number
}
