/* eslint-disable no-nested-ternary */

import styled, { DefaultTheme } from 'styled-components'
import { space } from 'styled-system'
import { ButtonProps } from './types'

type ThemedProps = {
  theme: DefaultTheme
} & ButtonProps

const getDisabledStyles = ({ isLoading, theme }: ThemedProps) => {
  if (isLoading === true) {
    return `
      &:disabled,
      &.button--disabled {
        cursor: not-allowed;
      }
    `
  }

  return `
    &:disabled,
    &.button--disabled {
      background-color: ${theme.colors.backgroundDisabled};
      border-color: ${theme.colors.backgroundDisabled};
      box-shadow: none;
      color: ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  `
}

const removePointerEvents = ({ disabled, as }: ThemedProps) => {
  if (disabled && as && as !== 'button') {
    return `
      pointer-events: none;
    `
  }

  return ''
}

const StyledButton = styled.button<ButtonProps>`
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  /* max-content instead of auto for Safari fix */
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'max-content')};
  height: ${({ size }) => (size === 'xs' ? '24px' : size === 'sm' ? '32px' : '48px')};
  line-height: 1;
  letter-spacing: 0.03em;
  justify-content: center;
  outline: 0;
  padding: ${({ size }) => (size === 'xs' || size === 'sm' ? '0 20px' : '0 24px')};
  transition: background-color 0.1s;
  opacity: ${({ isLoading }) => (isLoading ? 0.5 : 1)};

  ${getDisabledStyles}
  ${removePointerEvents}
  ${space}
`

StyledButton.defaultProps = {
  fullWidth: false,
  type: 'button',
  isStroke: false,
}

export default StyledButton
