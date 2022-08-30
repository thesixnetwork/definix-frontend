import { baseColors, brandColors, customColors, ColorStyles } from "./colors";

export type Breakpoints = string[];

export type MediaQueries = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  nav: string;
  mobile: string;
  mobileMd: string;
  mobileXl: string;
  mobileSwap: string;
};

export type Spacing = {
  [key: string]: number;
};

export type Radii = {
  small: string;
  default: string;
  card: string;
  circle: string;
  [key: string]: string;
};

export type Shadows = {
  level1: string;
  active: string;
  success: string;
  warning: string;
  focus: string;
  inset: string;
  elevation: string;
  elevation1: string;
  elevation2: string;
  elevation3: string;
  [key: string]: string;
};

export type Gradients = {
  bubblegum: string;
  [key: string]: string;
};

export type Colors = {
  [key in ColorStyles]: string;
} & {
  [key in keyof typeof baseColors]: string;
} & {
  [key in keyof typeof brandColors]: string;
} & {
  [key in keyof typeof customColors]: string;
} & Record<string, string>;

export type ZIndices = {
  dropdown: number;
  modal: number;
  nav: number;
  inner: number;
  sidebar: number;
  [key: string]: number;
};

export interface ExtendColorProps {
  color?: ColorStyles | string;
  backgroundColor?: ColorStyles | string;
  bg?: ColorStyles | string;
}
