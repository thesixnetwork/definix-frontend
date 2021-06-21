import styled, { DefaultTheme } from 'styled-components'
import { space } from 'styled-system'
import { CardProps } from './types'

interface StyledCardProps extends CardProps {
  theme: DefaultTheme
}

/**
 * Priority: Warning --> Success --> Active
 */
const getBoxShadow = ({ isActive, isSuccess, isWarning, isRainbow, theme }: StyledCardProps) => {
  if (isWarning) {
    return theme.card.boxShadowWarning
  }

  if (isSuccess) {
    return theme.card.boxShadowSuccess
  }

  if (isActive) {
    return theme.card.boxShadowActive
  }

  if (isRainbow) {
    return theme.shadows.elevation2
  }

  return theme.shadows.elevation1
}

const StyledCard = styled.div<StyledCardProps>`
  background-color: ${({ theme }) => theme.card.background};
  border: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${getBoxShadow};
  color: ${({ theme, isDisabled }) => theme.colors[isDisabled ? 'textDisabled' : 'text']};
  overflow: hidden;
  position: relative;

  ${space}

  .rainbow {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
  }
`

StyledCard.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
  isDisabled: false,
}

export default StyledCard
