import styled from "styled-components";
import { space, layout, variant as styledVariant } from "styled-system";
import { hexToRGB } from "../../mixin";
import { getVariantTextStyle } from "../../text";
import { scaleVariants, styleVariants } from "./theme";
import { BaseButtonProps, ButtonVariants } from "./types";
import { ColorStyles } from "../../colors";

const StyledButton = styled.button<BaseButtonProps>`
  position: relative;
  align-items: center;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  justify-content: ${({ startIcon, endIcon }) => (startIcon || endIcon ? "space-between" : "center")};
  outline: 0;

  &:hover:not(:disabled):not(.definix-button--disabled):not(.definix-button--disabled):not(:active) {
    &:after {
      content: "";
      border-radius: 8px;
      background-color: ${({ theme, variant }) =>
        variant === ButtonVariants.LINE ? `rgba(0, 0, 0, 0.05)` : hexToRGB('#ffffff', 0.2)};
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }

  &:disabled:not(.definix-button--loading),
  &.definix-button--disabled:not(.definix-button--loading) {
    background-color: ${({ theme, variant }) =>
      hexToRGB('#e0e0e0', variant === ButtonVariants.LINE ? 0.2 : 1)};
    color: ${({ theme, variant }) =>
      variant === ButtonVariants.LINE
        ? hexToRGB('#999999', 0.4)
        : hexToRGB('#ffffff', 0.8)};
    cursor: not-allowed;
  }

  &.definix-button--loading {
    cursor: not-allowed;
  }

  ${styledVariant({
    prop: "scale",
    variants: scaleVariants,
  })}
  ${styledVariant({
    variants: styleVariants,
  })}
  ${getVariantTextStyle()}
  ${layout}
  ${space}
`;

export const StyledLink = styled.a<BaseButtonProps>`
  position: relative;
  align-items: center;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  justify-content: ${({ startIcon, endIcon }) => (startIcon || endIcon ? "space-between" : "center")};
  outline: 0;

  &:hover:not(:disabled):not(.definix-button--disabled):not(.definix-button--disabled):not(:active) {
    &:after {
      content: "";
      border-radius: 8px;
      background-color: ${({ theme, variant }) =>
        variant === ButtonVariants.LINE ? `rgba(0, 0, 0, 0.05)` : hexToRGB('#ffffff', 0.2)};
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }

  &:disabled:not(.definix-button--loading),
  &.definix-button--disabled:not(.definix-button--loading) {
    background-color: ${({ theme, variant }) =>
      hexToRGB('#e0e0e0', variant === ButtonVariants.LINE ? 0.2 : 1)};
    color: ${({ theme, variant }) =>
      variant === ButtonVariants.LINE
        ? hexToRGB('#999999', 0.4)
        : hexToRGB('#ffffff', 0.8)};
    cursor: not-allowed;
  }

  &.definix-button--loading {
    cursor: not-allowed;
  }

  ${styledVariant({
    prop: "scale",
    variants: scaleVariants,
  })}
  ${styledVariant({
    variants: styleVariants,
  })}
  ${getVariantTextStyle()}
  ${layout}
  ${space}
`;

export default StyledButton;
