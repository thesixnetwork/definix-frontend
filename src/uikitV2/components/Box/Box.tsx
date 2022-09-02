import { background, border, layout, position, space, color } from 'styled-system'
import styled from 'styled-components'
import { BoxProps } from './types'
import { getVariantTextStyle } from '../../text'

const Box = styled.div<BoxProps>`
  ${background}
  ${color}
  ${border}
  ${layout}
  ${position}
  ${space}
  ${getVariantTextStyle()}
`

export default Box
