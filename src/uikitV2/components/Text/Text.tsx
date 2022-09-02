import styled from 'styled-components'
import { space, typography, color, layout } from 'styled-system'
import { getVariantTextStyle } from '../../text'
import { TextProps } from './types'

const Text = styled.div<TextProps>`
  white-space: pre-line;
  word-break: keep-all;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${space}
  ${typography}
  ${getVariantTextStyle()}
  ${color}
  ${layout}
`

Text.defaultProps = {
  small: false,
}

export default Text
