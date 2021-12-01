import styled, { DefaultTheme } from 'styled-components'
import { space, typography } from 'styled-system'
import getThemeValue from '../../util/getThemeValue'
import { TextProps } from './types'

interface ThemedProps extends TextProps {
  theme: DefaultTheme
}

const getColor = ({ color, theme }: ThemedProps) => {
  return getThemeValue(`colors.${color}`, color)(theme)
}

const getFontSize = ({ fontSize }: TextProps) => {
  return fontSize || '14px'
}

const Text = styled.div<TextProps>`
  color: ${getColor};
  font-size: ${getFontSize};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  line-height: 1.5;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ ellipsis }) => ellipsis && `white-space: nowrap; text-overflow: ellipsis; overflow: hidden;`}
  ${space}
  ${typography}
`

Text.defaultProps = {
  color: 'text',
  small: false,
}

export default Text
