import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { CardRibbonProps } from './types'
import { spacing, mediaQueries } from '../../base'
import { textStyle } from '../../text'
import { pxToRem } from '../../mixin'
import { baseColors as colors } from '../../colors'

interface StyledCardRibbonProps extends CardRibbonProps {
  theme: DefaultTheme
}

const StyledCardRibbon = styled.div<Partial<StyledCardRibbonProps>>`
  background-color: ${({ variantColor = 'yellow' }) => colors[variantColor]};
  position: absolute;
  left: unset;
  top: 16px;
  padding: 5px ${spacing.S_20}px;
  border-top-right-radius: ${pxToRem(spacing.S_8)};
  border-bottom-right-radius: ${pxToRem(spacing.S_8)};
  z-index: 2;
  ${textStyle.R_12B}
  color: white;
  ${({ upperCase }) => upperCase && 'text-transform: uppercase;'};
  ${mediaQueries.mobileXl} {
    top: 12px;
    padding: 3px ${spacing.S_12}px;
  }
`

const CardRibbon: React.FC<CardRibbonProps> = ({ variantColor = 'yellow', text, upperCase }) => {
  return (
    <StyledCardRibbon variantColor={variantColor} upperCase={upperCase}>
      <div title={text}>{text}</div>
    </StyledCardRibbon>
  )
}

export default CardRibbon
