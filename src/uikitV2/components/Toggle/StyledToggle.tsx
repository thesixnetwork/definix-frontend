import styled from "styled-components";
import { scales } from "../Checkbox/types";
import { ToggleProps, HandleProps, InputProps, ScaleKeys } from "./types";
import { ColorStyles } from "../../colors";

const scaleKeyValues = {
  sm: {
    handleHeight: "20px",
    handleWidth: "20px",
    handleLeft: "4px",
    handleTop: "4px",
    checkedLeft: "calc(100% - 24px)",
    toggleHeight: "28px",
    toggleWidth: "56px",
    borderRadius: "14px",
  },
  md: {
    handleHeight: "32px",
    handleWidth: "32px",
    handleLeft: "4px",
    handleTop: "4px",
    checkedLeft: "calc(100% - 36px)",
    toggleHeight: "40px",
    toggleWidth: "72px",
    borderRadius: "72px",
  },
};

const getScale =
  (property: ScaleKeys) =>
  ({ scale = scales.SM }: ToggleProps) => {
    return scaleKeyValues[scale][property];
  };

export const Handle = styled.div<HandleProps>`
  background-color: ${({ theme }) => theme.toggle.handleBackground};
  border-radius: 50%;
  cursor: pointer;
  height: ${getScale("handleHeight")};
  left: ${getScale("handleLeft")};
  position: absolute;
  top: ${getScale("handleTop")};
  transition: left 200ms ease-in;
  width: ${getScale("handleWidth")};
  z-index: 1;
`;

export const Input = styled.input<InputProps>`
  cursor: pointer;
  opacity: 0;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 3;

  &:checked + ${Handle} {
    left: ${getScale("checkedLeft")};
  }
`;

const StyledToggle = styled.div<ToggleProps>`
  align-items: center;
  border-radius: ${getScale("borderRadius")};
  cursor: pointer;
  display: inline-flex;
  height: ${getScale("toggleHeight")};
  position: relative;
  transition: background-color 200ms;
  width: ${getScale("toggleWidth")};
  background-color: ${({ checked, theme }) =>
    checked ? theme.colors[ColorStyles.RED] : theme.colors[ColorStyles.PALE]};
`;

export default StyledToggle;
