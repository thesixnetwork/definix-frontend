import { ExtendColorProps } from "../../types";
import { LayoutProps, SpaceProps, TypographyProps } from "styled-system";

export interface TextProps extends SpaceProps, TypographyProps, LayoutProps, ExtendColorProps {
  fontSize?: string;
  bold?: boolean;
  small?: boolean;
  textStyle?: string;
  textColor?: string;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
}
