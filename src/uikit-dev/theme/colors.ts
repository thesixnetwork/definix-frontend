import polygonBlack from 'uikit-dev/images/for-ui-v2/polygon-black.png'
import polygonWhite from 'uikit-dev/images/for-ui-v2/polygon-white.png'
import { Colors } from './types'

export const baseColors = {
  failure: '#d42837',
  primary: '#1587C9',
  primaryBright: '#59a1ec',
  primaryDark: '#004889',
  secondary: '#0973B9',
  success: '#2A9D8F',
  successAlpha: 'rgba(42,157,143,0.1)',
  warning: '#E5B339',
}

export const brandColors = {
  binance: '#F0B90B',
}

export const lightColors: Colors = {
  ...baseColors,
  ...brandColors,
  background: '#FCFCFC',
  backgroundHeader: '#FFFFFF',
  backgroundSideMenu: '#FFFFFF',
  backgroundFooter: '#FFFFFF',
  backgroundDisabled: '#F6F7FA',
  backgroundBox: 'rgba(186, 191, 199, 0.12)',
  backgroundGray: '#F7F6FB',
  backgroundRadial: 'radial-gradient(#FFFFFF, #e2e7f4)',
  backgroundPolygon: polygonWhite,
  backgroundBlueGradient: 'linear-gradient(#0D418E, #349BE7)',

  contrast: '#191326',
  invertedContrast: '#FFFFFF',
  input: '#EFF4F5',
  tertiary: '#EFF4F5',
  text: '#222331',
  textDisabled: '#D7D7D7',
  textSubtle: '#8C90A5',
  card: '#FFFFFF',
  cardFooter: '#fafcff',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)',
  },
  border: '#ECECEC',
  white: '#FFFFFF',
  placeholder: '#CCCCCC',
  harvest: '#24B181',
  grayBlue: '#e2e7f4',
}

export const darkColors: Colors = {
  ...baseColors,
  ...brandColors,
  secondary: '#9A6AFF',
  background: '#100C18',
  backgroundHeader: '#1E1E1E',
  backgroundSideMenu: '#2E2F30',
  backgroundFooter: '#1C1C1D',
  backgroundDisabled: '#2c2c2c',
  backgroundBox: 'rgba(186, 191, 199, 0.12)',
  backgroundGray: '#F7F6FB',
  backgroundRadial: '#1A1A1A',
  backgroundPolygon: polygonBlack,
  backgroundBlueGradient: 'linear-gradient(#0D418E, #349BE7)',

  contrast: '#FFFFFF',
  invertedContrast: '#2c2c2c',
  input: '#483f5a',
  primaryDark: '#0098A1',
  tertiary: '#2c2c2c',
  text: '#FFFFFF',
  textDisabled: '#464646',
  textSubtle: '#737375',
  card: '#212121',
  cardFooter: '#212121',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)',
  },
  border: '#57575B',
  white: '#FFFFFF',
  placeholder: '#CCCCCC',
  harvest: '#24B181',
  grayBlue: '#e2e7f4',
}
