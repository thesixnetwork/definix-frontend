import styled from 'styled-components'
import { space, SpaceProps } from 'styled-system'
import { spacing } from '../../base'
import { pxToRem } from '../../mixin'

export type CardBodyProps = SpaceProps

const CardBody = styled.div<CardBodyProps>`
  ${space}
`

CardBody.defaultProps = {
  p: pxToRem(spacing.S_32),
}

export default CardBody
