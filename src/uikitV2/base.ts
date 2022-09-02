import { MediaQueries, Breakpoints, Spacing } from './types'

export const breakpointMap: { [key: string]: number } = {
  xs: 320,
  sm: 576,
  md: 768,
  lg: 960,
  xl: 1280,
  xxl: 1440,
}

export const breakpoints: Breakpoints = Object.values(breakpointMap).map((breakpoint) => `${breakpoint}px`)

export const mediaQueries: MediaQueries = {
  xs: `@media screen and (min-width: ${breakpointMap.xs}px)`,
  sm: `@media screen and (min-width: ${breakpointMap.sm}px)`,
  md: `@media screen and (min-width: ${breakpointMap.md}px)`,
  lg: `@media screen and (min-width: ${breakpointMap.lg}px)`,
  xl: `@media screen and (min-width: ${breakpointMap.xl}px)`,
  xxl: `@media screen and (min-width: ${breakpointMap.xxl}px)`,
  nav: `@media screen and (min-width: ${breakpointMap.lg}px)`,

  mobileMd: `@media screen and (max-width: ${breakpointMap.md}px)`,
  mobile: `@media screen and (max-width: ${breakpointMap.lg}px)`,
  mobileXl: `@media screen and (max-width: ${breakpointMap.xl}px)`,
  mobileSwap: `@media screen and (max-width: ${breakpointMap.lg}px)`,
}

export const shadows = {
  // level1: "0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)",
  // active: "0px 0px 0px 1px #0098A1, 0px 0px 4px 8px rgba(31, 199, 212, 0.4)",
  // success: "0px 0px 0px 1px #31D0AA, 0px 0px 0px 4px rgba(49, 208, 170, 0.2)",
  // warning: "0px 0px 0px 1px #ED4B9E, 0px 0px 0px 4px rgba(237, 75, 158, 0.2)",
  // focus: "0px 0px 0px 1px #7645D9, 0px 0px 0px 4px rgba(118, 69, 217, 0.6)",
  // inset: "inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1)",

  level1: '0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)',
  active: '0px 0px 0px 1px #0098A1, 0px 0px 4px 8px rgba(31, 199, 212, 0.4)',
  success: '0px 0px 0px 1px #31D0AA, 0px 0px 0px 4px rgba(49, 208, 170, 0.2)',
  warning: '0px 0px 0px 1px #d42837, 0px 0px 0px 4px rgba(212, 40, 55, 0.2)',
  focus: '0px 0px 0px 1px #0973B9, 0px 0px 0px 4px rgba(9, 115, 185, 0.2)',
  inset: 'inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1)',
  inset2: 'inset 0 6px 30px rgba(165, 194, 205, 0.5)',
  inset3: 'inset 0 1px 15px rgba(16, 39, 72, 0.2)',
  elevation: '0 1px 2px rgba(0,0,0,0.16)',
  elevation1: '0 3px 6px rgba(0,0,0,0.16)',
  elevation2: '0 6px 9px rgba(0,0,0,0.16)',
  elevation3: '0 6px 30px rgba(165, 194, 205, 0.5)',
}

export const spacing: Spacing = {
  S_2: 2,
  S_4: 4,
  S_6: 6,
  S_8: 8,
  S_10: 10,
  S_12: 12,
  S_14: 14,
  S_16: 16,
  S_20: 20,
  S_22: 22,
  S_24: 24,
  S_28: 28,
  S_30: 30,
  S_32: 32,
  S_40: 40,
  S_42: 42,
  S_60: 60,
  S_80: 80,
}

export const space: Spacing = spacing

const radii = {
  small: '4px',
  default: '16px',
  card: '32px',
  circle: '50%',
}

const zIndices = {
  dropdown: 10,
  modal: 100,
  nav: 90,
  inner: 85,
  sidebar: 95,
  wrongNetwork: 86,
}

export default {
  siteWidth: 1200,
  breakpoints,
  mediaQueries,
  spacing,
  space,
  shadows,
  radii,
  zIndices,
}
