import { Flex } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

export const FadedSpan = styled(Flex)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
`

export const MenuItem = styled(Flex)<{ disabled: boolean; selected: boolean }>`
  padding: 14px 0;
  min-height: 60px;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.colors.invertedContrast};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 10px 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 8px;
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.colors.border};
  -webkit-appearance: none;
  font-size: 14px;
  color: #222222;
  ::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
    font-size: 14px;
  }
  transition: border 100ms;
  :focus {
    outline: none;
  }
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
`

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.tertiary};
`
