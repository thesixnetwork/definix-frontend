import React, { useState, Children, ReactElement, cloneElement } from "react";
import styled from "styled-components";
import { layout, position as sPosition } from "styled-system";
import DropdownButton from "../Button/DropdownButton";
import DropdownItem from "./DropdownItem";
import { DropdownSetProps, Position } from "./types";

const DropdownContent = styled.div<{ position: Position; isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};

  border-radius: 8px;
  box-shadow: 0 4px 4px 0 rgba(34, 34, 34, 0.1);
  border: solid 1px #e0e0e0;
  background-color: #ffffff;

  min-width: 100%;
  flex-direction: column;
  position: absolute;
  left: 0;
  max-height: 400px;
  overflow-y: auto;
  z-index: 10;

  ::-webkit-scrollbar {
    width: 0px;
  }

  ${({ position }) => `
    ${position === "top" ? "bottom" : "top"}: 100%;
    margin-${position === "top" ? "bottom" : "top"}: 4px;
  `}
  ${sPosition}
  ${layout}
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
`;

const DropdownSet: React.FC<DropdownSetProps> = ({
  position = "bottom",
  options,
  scale,
  isOpen,
  activeIndex,
  onButtonClick,
  onOptionClick,
  ...props
}) => {
  return (
    <Container>
      <DropdownButton width="100%" onClick={onButtonClick}>
        {options[activeIndex].label}
      </DropdownButton>
      <DropdownContent position={position} isOpen={isOpen} {...props}>
        {options.map((option, index) => {
          return (
            <DropdownItem
              key={option.id}
              scale={scale}
              isActive={activeIndex === index}
              onClick={() => onOptionClick(index)}
            >
              {option.label}
            </DropdownItem>
          );
        })}
      </DropdownContent>
    </Container>
  );
};
DropdownSet.defaultProps = {
  position: "bottom",
  scale: "md",
};

export default DropdownSet;
