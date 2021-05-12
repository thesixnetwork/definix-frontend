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
  medium: string
  large: string
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
  inset2: string
  elevation1: string
  elevation2: string
  elevation3: string
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
  successAlpha: string
  failure: string
  warning: string
  contrast: string
  invertedContrast: string
  input: string
  background: string
  backgroundDisabled: string
  backgroundBox: string
  backgroundGray: string
  backgroundRadial: string
  text: string
  textDisabled: string
  textSubtle: string
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
