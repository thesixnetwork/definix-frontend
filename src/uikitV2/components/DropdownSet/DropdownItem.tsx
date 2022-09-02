import { hexToRGB } from '../../mixin'
import React from 'react'
import styled from 'styled-components'
import { DropdownItemProps, Scale, scales } from './types'

const Item = styled.div<{ isActive: boolean; scale: Scale; isDivide?: boolean }>`
  cursor: pointer;
  padding: 0 16px;
  min-width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  color: #666666;
  ${({ isActive }) =>
    isActive
      ? 'font-family: var(--default-font-family); font-size: 0.875rem; font-weight: 500; font-stretch: normal; font-style: normal; line-height: 1.43; letter-spacing: normal;'
      : 'font-family: var(--default-font-family); font-size: 0.875rem; font-weight: normal; font-stretch: normal; font-style: normal; line-height: 1.43; letter-spacing: normal;'}
  ${({ isDivide }) => isDivide && `border-top: 1px solid #e0e0e0;`}
  white-space: nowrap;

  background-color: #ffffff;
  &:hover {
    background-color: ${({ theme }) => hexToRGB('#dad0c5', 0.2)};
  }
`

const DropdownItem: React.FC<DropdownItemProps> = ({ children, isActive = false, scale = 'md', ...props }) => {
  return (
    <Item isActive={isActive} scale={scale} {...props}>
      {children}
    </Item>
  )
}

export default DropdownItem
