import { MediaQueries, Breakpoints, Spacing } from './types'

export const breakpointMap: { [key: string]: number } = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
}

const breakpoints: Breakpoints = Object.values(breakpointMap).map((breakpoint) => `${breakpoint}px`)

const mediaQueries: MediaQueries = {
  xs: `@media screen and (min-width: ${breakpointMap.xs}px)`,
  sm: `@media screen and (min-width: ${breakpointMap.sm}px)`,
  md: `@media screen and (min-width: ${breakpointMap.md}px)`,
  lg: `@media screen and (min-width: ${breakpointMap.lg}px)`,
  xl: `@media screen and (min-width: ${breakpointMap.xl}px)`,
  nav: `@media screen and (min-width: ${breakpointMap.md}px)`,
}

export const shadows = {
  level1: '0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)',
  active: '0px 0px 0px 1px #0098A1, 0px 0px 4px 8px rgba(31, 199, 212, 0.4)',
  success: '0px 0px 0px 1px #31D0AA, 0px 0px 0px 4px rgba(49, 208, 170, 0.2)',
  warning: '0px 0px 0px 1px #d42837, 0px 0px 0px 4px rgba(212, 40, 55, 0.2)',
  focus: '0px 0px 0px 1px #0973B9, 0px 0px 0px 4px rgba(9, 115, 185, 0.2)',
  inset: 'inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1)',
  inset2: 'inset 0 6px 30px rgba(165, 194, 205, 0.5)',
  elevation1: '0 3px 6px rgba(0,0,0,0.16)',
  elevation2: '0 6px 9px rgba(0,0,0,0.16)',
  elevation3: '0 6px 30px rgba(165, 194, 205, 0.5)',
}

const spacing: Spacing = [0, 4, 8, 16, 24, 32, 48, 64]

const radii = {
  small: '8px',
  medium: '16px',
  large: '32px',
  default: '8px',
  card: '8px',
  circle: '50%',
}

const zIndices = {
  dropdown: 10,
  modal: 100,
}

export default {
  siteWidth: 1200,
  breakpoints,
  breakpointMap,
  mediaQueries,
  spacing,
  shadows,
  radii,
  zIndices,
}
