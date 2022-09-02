import styled from 'styled-components'
import { space, SpaceProps } from 'styled-system'
import { spacing } from '../../base'
import { pxToRem } from '../../mixin'

export type CardFooterProps = SpaceProps

const CardFooter = styled.div<CardFooterProps>`
  ${space}
`

CardFooter.defaultProps = {
  p: pxToRem(spacing.S_32),
}

export default CardFooter
