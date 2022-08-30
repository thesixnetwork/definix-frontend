import React, { ElementType } from "react";
import styled from "styled-components";
import { space } from "styled-system";
import StyledButton from "./StyledButton";
import { BaseButtonProps, IconButtonProps } from "./types";

const StyledIconButton = styled(StyledButton)<BaseButtonProps>`
  padding: 4px;
  width: auto;
  border-radius: 0;
  background-color: transparent;
  border: none;
  ${space}
`;

const IconButton = <E extends ElementType = "button">(props: IconButtonProps<E>): JSX.Element => {
  const { children, ...rest } = props;
  return <StyledIconButton {...rest}>{children}</StyledIconButton>;
};
export default IconButton;
