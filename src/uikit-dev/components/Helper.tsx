/* eslint-disable no-nested-ternary */
import React from 'react'
import { HelpCircle } from 'react-feather'
import styled from 'styled-components'

const HelperStyled = styled.div`
  position: relative;

  &:hover > div {
    opacity: 1;
    visibility: visible;
  }
`

const PopoverStyled = styled.div<{ position: string }>`
  transition: 0.2s;
  width: max-content;
  max-width: 180px;
  position: absolute;
  top: ${({ position }) => (position === 'top' ? 'auto' : position === 'bottom' ? 'calc(100% + 8px)' : '50%')};
  left: ${({ position }) => (position === 'left' ? 'auto' : position === 'right' ? 'calc(100% + 8px)' : '50%')};
  bottom: ${({ position }) => (position === 'top' ? 'calc(100% + 8px)' : 'auto')};
  right: ${({ position }) => (position === 'left' ? 'calc(100% + 8px)' : 'auto')};
  transform: ${({ position }) =>
    position === 'top' || position === 'bottom' ? 'translate(-50%, 0)' : 'translate(0, -50%)'};
  z-index: 1;
  font-size: 12px;
  padding: 12px;
  line-height: 1.5;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  opacity: 0;
  visibility: hidden;

  &:before {
    content: '';
    width: 0;
    height: 0;
    border: 8px solid transparent;
    position: absolute;
    border-top-color: ${({ position, theme }) => (position === 'top' ? theme.colors.white : 'transparent')};
    border-right-color: ${({ position, theme }) => (position === 'right' ? theme.colors.white : 'transparent')};
    border-bottom-color: ${({ position, theme }) => (position === 'bottom' ? theme.colors.white : 'transparent')};
    border-left-color: ${({ position, theme }) => (position === 'left' ? theme.colors.white : 'transparent')};
    top: ${({ position }) => (position === 'top' ? '100%' : position === 'bottom' ? '-16px' : 'calc(50% - 8px)')};
    left: ${({ position }) => (position === 'left' ? '100%' : position === 'right' ? '-16px' : 'calc(50% - 8px)')};
  }
`

const Helper = ({ text, className = '', position = 'left' }) => {
  return (
    <HelperStyled className={className}>
      <HelpCircle width={16} height={16} color="#0973B9" />

      <PopoverStyled position={position}>{text}</PopoverStyled>
    </HelperStyled>
  )
}

export default Helper
