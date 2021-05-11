import { Colors } from './types'

export const baseColors = {
  failure: '#d42837',
  primary: '#0973B9',
  primaryBright: '#59a1ec',
  primaryDark: '#004889',
  secondary: '#0973B9',
  success: '#24B181',
  warning: '#FFB237',
}

export const brandColors = {
  binance: '#F0B90B',
}

export const lightColors: Colors = {
  ...baseColors,
  ...brandColors,
  background: '#FCFCFC',
  backgroundDisabled: '#D8D6DE',
  backgroundBox: 'rgba(186, 191, 199, 0.12)',
  contrast: '#191326',
  invertedContrast: '#FFFFFF',
  input: '#EFF4F5',
  tertiary: '#EFF4F5',
  text: '#404041',
  textDisabled: '#BDC2C4',
  textSubtle: '#404041',
  borderColor: '#E9EAEB',
  card: '#FFFFFF',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)',
  },
  border: '#D8D6DE',
  white: '#FFFFFF',
  placeholder: '#CCCCCC',
  harvest: '#24B181',
}

export const darkColors: Colors = {
  ...baseColors,
  ...brandColors,
  secondary: '#9A6AFF',
  background: '#100C18',
  backgroundDisabled: '#3c3742',
  backgroundBox: 'rgba(186, 191, 199, 0.12)',
  contrast: '#FFFFFF',
  invertedContrast: '#191326',
  input: '#483f5a',
  primaryDark: '#0098A1',
  tertiary: '#353547',
  text: '#EAE2FC',
  textDisabled: '#666171',
  textSubtle: '#A28BD4',
  borderColor: '#524B63',
  card: '#27262c',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)',
  },
  border: '#D8D6DE',
  white: '#FFFFFF',
  placeholder: '#CCCCCC',
  harvest: '#24B181',
}
