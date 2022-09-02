import styled from "styled-components";
import { CheckboxProps, scales } from "./types";
import checkIcon from "./ico_16_check_b.png";

const getR = ({ scale }: CheckboxProps) => {
  switch (scale) {
    case scales.SM:
      return "4px";
    case scales.MD:
    default:
      return "50%";
  }
};

const getScale = ({ scale }: CheckboxProps) => {
  switch (scale) {
    case scales.SM:
      return "18px";
    case scales.MD:
    default:
      return "24px";
  }
};

const Checkbox = styled.input.attrs({ type: "checkbox" })<CheckboxProps>`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: ${getScale};
  width: ${getScale};
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border: 0;
  border-radius: ${getR};
  background-color: #ffffff;
  box-shadow: 0px 0px 0px 1px #e0e0e0 inset;
  margin: 0;

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  &:checked {
    background-color: #ff5532;
    box-shadow: none;
    &:after {
      background: url(${checkIcon}) no-repeat center;
    }
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

Checkbox.defaultProps = {
  scale: scales.MD,
};

export default Checkbox;
