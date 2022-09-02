import React from "react";
import { LabelProps } from "./types";
import { StyledLabel } from "./StyledLabel";

const Label: React.FC<LabelProps> = ({ type, children, ...props }) => {
  return (
    <StyledLabel type={type} {...props}>
      {children}
    </StyledLabel>
  );
};
export default Label;
