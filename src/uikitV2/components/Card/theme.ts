import { darkColors, lightColors, ColorStyles } from '../../colors'
import { shadows } from '../../base'
import { CardTheme } from './types'

export const light: CardTheme = {
  background: lightColors[ColorStyles.WHITE],
  boxShadow: `0px 0px 0px 1px ${lightColors[ColorStyles.YELLOWBG2]}, 0 12px 12px 0 rgba(254, 169, 72, 0.2)`,
  onlyBoxShadow: '0 12px 12px 0 rgba(254, 169, 72, 0.2)',
  boxShadowActive: shadows.active,
  boxShadowSuccess: shadows.success,
  boxShadowWarning: shadows.warning,
  cardHeaderBackground: 'linear-gradient(111.68deg, #F2ECF2 0%, #E8F2F6 100%)',
  dropShadow: 'drop-shadow(0px 1px 4px rgba(25, 19, 38, 0.15))',
}

export const dark: CardTheme = {
  background: darkColors[ColorStyles.WHITE],
  boxShadow: '0 12px 12px 0 rgba(254, 169, 72, 0.2)',
  onlyBoxShadow: '0 12px 12px 0 rgba(254, 169, 72, 0.2)',
  boxShadowActive: shadows.active,
  boxShadowSuccess: shadows.success,
  boxShadowWarning: shadows.warning,
  cardHeaderBackground: 'linear-gradient(166.77deg, #3B4155 0%, #3A3045 100%)',
  dropShadow: 'drop-shadow(0px 1px 4px rgba(25, 19, 38, 0.15))',
}
