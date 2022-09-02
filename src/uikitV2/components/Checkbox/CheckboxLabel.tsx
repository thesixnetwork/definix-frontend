import React from "react";
import styled from "styled-components";
import { border, layout, position, space } from "styled-system";
import { CheckboxLabelProps } from "./types";

const StyledCheckboxLabel = styled.label`
  ${border}
  ${layout}
  ${position}
  ${space}
  display: flex;
  align-items: center;
  > input {
    flex-shrink: 0;
    margin-right: 12px;
    &[scale="sm"] {
      margin-right: 8px;
    }
  }
`;

const CheckboxLabel: React.FC<CheckboxLabelProps> = ({ control, children, ...props }) => {
  return (
    <StyledCheckboxLabel {...props}>
      {control}
      {children}
    </StyledCheckboxLabel>
  );
};

export default CheckboxLabel;
