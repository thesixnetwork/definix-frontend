import React from 'react'
import styled from 'styled-components'
import rainbowImg from '../../images/Color-stroke.png'
import { DropdownProps, Position, PositionProps } from './types'

const getLeft = ({ position }: PositionProps) => {
  if (position === 'top-right') {
    return '100%'
  }
  if (position === 'bottom-right') {
    return 'auto'
  }
  return '50%'
}

const getRight = ({ position }: PositionProps) => {
  if (position === 'bottom-right') {
    return '0'
  }
  return 'auto'
}

const getBottom = ({ position }: PositionProps) => {
  if (position === 'top' || position === 'top-right') {
    return '100%'
  }
  return 'auto'
}

const getTransform = ({ position }: PositionProps) => {
  if (position === 'bottom-right') {
    return 'none'
  }
  return 'translate(-50%, 0)'
}

const DropdownContent = styled.div<{ position: Position; isFullWidth: boolean }>`
  width: ${(props) => (props.isFullWidth ? '100%' : 'max-content')};
  display: none;
  flex-direction: column;
  position: absolute;
  transform: ${getTransform};
  left: ${getLeft};
  bottom: ${getBottom};
  right: ${getRight};
  background-color: ${({ theme }) => theme.nav.background};
  box-shadow: ${({ theme }) => theme.shadows.elevation2};
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  border-radius: ${({ theme }) => theme.radii.small};
  border: 1px solid ${({ theme }) => theme.colors.border};

  .rainbow {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
  }
`

const Container = styled.div`
  position: relative;
  &:hover ${DropdownContent}, &:focus-within ${DropdownContent} {
    display: flex;
  }
`

const Dropdown: React.FC<DropdownProps> = ({
  target,
  position = 'bottom',
  isRainbow,
  children,
  isFullWidth = false,
}) => {
  return (
    <Container>
      {target}
      <DropdownContent position={position} isFullWidth={isFullWidth}>
        {children}
        {isRainbow && <img className="rainbow" alt="" src={rainbowImg} />}
      </DropdownContent>
    </Container>
  )
}
Dropdown.defaultProps = {
  position: 'bottom',
}

export default Dropdown
