import styled from 'styled-components'
import Button from './Button'
import { ButtonProps } from './types'

const IconButton = styled(Button)<ButtonProps>`
  padding: 0 !important;
  width: ${({ size }) => (size === 'xs' ? '24px' : size === 'sm' ? '32px' : '48px')};
`

export default IconButton
