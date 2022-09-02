import styled, { DefaultTheme } from "styled-components";
import { color, space } from "styled-system";
import { CardProps } from "./types";
import { pxToRem } from "../../mixin";
import { spacing } from "../../base";
import { baseColors as colors } from "../../colors";
import { light } from './theme'

interface StyledCardProps extends CardProps {
  theme: DefaultTheme;
}

/**
 * Priority: Warning --> Success --> Active
 */
const getBoxShadow = ({ isActive, isSuccess, isWarning, theme, cardBg }: StyledCardProps) => {
  if (isWarning) {
    return light.boxShadowWarning;
  }

  if (isSuccess) {
    return light.boxShadowSuccess;
  }

  if (isActive) {
    return light.boxShadowActive;
  }

  if (cardBg) {
    return light.onlyBoxShadow;
  }

  return light.boxShadow;
};

const StyledCard = styled.div<StyledCardProps>`
  background-color: ${({ cardBg }) => (cardBg ? colors[cardBg] : light.background)};
  border-radius: ${pxToRem(spacing.S_16)};

  box-shadow: ${getBoxShadow};
  position: relative;
  overflow: ${({ isOverflowHidden }) => (isOverflowHidden ? "hidden" : "auto")};
  ${space}
  ${color}
`;

StyledCard.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
  isDisabled: false,
};

export default StyledCard;
