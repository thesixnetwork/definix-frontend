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

const PopoverStyled = styled.div`
  transition: 0.2s;
  width: 180px;
  position: absolute;
  bottom: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
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
    border-top-color: ${({ theme }) => theme.colors.white};
    position: absolute;
    left: calc(50% - 8px);
    bottom: -16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    bottom: auto;
    left: auto;
    top: 50%;
    transform: translate(0, -50%);
    right: calc(100% + 16px);

    &:before {
      border-color: transparent;
      border-left-color: ${({ theme }) => theme.colors.white};
      bottom: auto;
      left: auto;
      top: calc(50% - 8px);
      right: -16px;
    }
  }
`

const Helper = ({ text, className = '' }) => {
  return (
    <HelperStyled className={className}>
      <HelpCircle width={16} height={16} color="#0973B9" />

      <PopoverStyled>{text}</PopoverStyled>
    </HelperStyled>
  )
}

export default Helper
