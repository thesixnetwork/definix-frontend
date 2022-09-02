import { HTMLAttributes } from "react";
import { SpaceProps } from "styled-system";
import { Colors, ExtendColorProps } from "../../types";

export type CardBg = keyof Colors;

export interface CardRibbonProps {
  variantColor?: keyof Colors;
  upperCase?: boolean;
  text: string;
}

export type CardTheme = {
  background: string;
  boxShadow: string;
  onlyBoxShadow: string;
  boxShadowActive: string;
  boxShadowSuccess: string;
  boxShadowWarning: string;
  cardHeaderBackground: string;
  dropShadow: string;
};

export interface CardProps extends SpaceProps, HTMLAttributes<HTMLDivElement>, ExtendColorProps {
  isActive?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  isDisabled?: boolean;
  ribbon?: React.ReactNode;
  isOverflowHidden?: boolean;
  cardBg?: CardBg;
}
