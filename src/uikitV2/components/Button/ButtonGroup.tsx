import styled from "styled-components";
import React from "react";
import { ButtonGroupProps } from "./types";
import { Box } from "../Box";

const StyledButtonGroup = styled(Box)<{ r: string }>`
  display: inline-flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ r }) => r || "8px"};

  button {
    margin: 0;
    flex-shrink: 0;
    border-radius: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.border} !important;

    &:first-child {
      border-top-left-radius: ${({ r }) => r || "8px"};
      border-bottom-left-radius: ${({ r }) => r || "8px"};
    }
    &:last-child {
      border: none !important;
      border-top-right-radius: ${({ r }) => r || "8px"};
      border-bottom-right-radius: ${({ r }) => r || "8px"};
    }
  }
`;

const ButtonGroup: React.FC<ButtonGroupProps> = ({ r = "", children, ...props }) => {
  return (
    <StyledButtonGroup width="fit-content" r={r} {...props}>
      {children}
    </StyledButtonGroup>
  );
};

export default ButtonGroup;
