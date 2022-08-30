import { ComponentProps, ElementType, ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";
import { LayoutProps, SpaceProps } from "styled-system";
import { BoxProps } from "../Box";

export enum ButtonScales {
  // new
  ICON = "icon",

  LG = "lg", // 48
  MD = "md", // 40
  SM = "sm", // 36
  XS = "xs", // 32
}

export enum ButtonVariants {
  // new
  RED = "red",
  BROWN = "brown",
  LIGHTBROWN = "lightbrown",
  DEEPBROWN = "deepbrown",
  LINE = "line",
  TRANSPARENT = "transparent",
  YELLOW = "yellow",
  BROWN30 = "brown30",

  // old
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary",

  TEXT = "text",
  DANGER = "danger",
  SUBTLE = "subtle",
  SUCCESS = "success",
}

/**
 * @see https://www.benmvp.com/blog/polymorphic-react-components-typescript/
 */
export type AsProps<E extends ElementType = ElementType> = {
  as?: E;
};

export type MergeProps<E extends ElementType> = AsProps<E> & Omit<ComponentProps<E>, keyof AsProps>;

export type PolymorphicComponentProps<E extends ElementType, P> = P & MergeProps<E>;

export type PolymorphicComponent<P, D extends ElementType = "button"> = <E extends ElementType = D>(
  props: PolymorphicComponentProps<E, P>
) => ReactElement | null;

export interface BaseButtonProps extends LayoutProps, SpaceProps {
  as?: "a" | "button" | typeof Link;
  external?: boolean;
  isLoading?: boolean;
  scale?: ButtonScales | string;
  variant?: ButtonVariants | string;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  textStyle?: string;
  isAutoMinWidth?: boolean;

  md?: boolean;
  sm?: boolean;
  xs?: boolean;
  lg?: boolean;
  icon?: boolean;
}

export type ButtonProps<P extends ElementType = "button"> = PolymorphicComponentProps<P, BaseButtonProps>;

export type IconButtonProps<P extends ElementType = "button"> = PolymorphicComponentProps<P, BaseButtonProps>;

export interface ButtonGroupProps extends BoxProps {
  r?: string;
}

export interface DoubleArrowButtonsProps {
  type?: string;
  disableLeftArrow: boolean;
  disableRightArrow: boolean;
  onClickLeftArrow: () => any;
  onClickRightArrow: () => any;
}
