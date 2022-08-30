import { ArrowBottomGIcon } from "../Icon";
import { TextStyles } from "../../text";
import React from "react";
import Button from "./Button";
import { ButtonProps, ButtonVariants, ButtonScales } from "./types";

const DropdownButton: React.FC<ButtonProps> = (props) => {
  const { children } = props;
  return (
    <Button textStyle={TextStyles.R_14M} minWidth={90} endIcon={<ArrowBottomGIcon />} {...props}>
      {children}
    </Button>
  );
};

DropdownButton.defaultProps = {
  scale: ButtonScales.MD,
  variant: ButtonVariants.LINE,
};

export default DropdownButton;
