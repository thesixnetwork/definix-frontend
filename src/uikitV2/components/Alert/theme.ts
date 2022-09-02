import { darkColors, lightColors, ColorStyles } from "../../colors";
import { AlertTheme } from "./types";

export const light: AlertTheme = {
  background: lightColors[ColorStyles.WHITE],
  border: lightColors[ColorStyles.YELLOWBG2],
};

export const dark: AlertTheme = {
  background: darkColors[ColorStyles.WHITE],
  border: lightColors[ColorStyles.YELLOWBG2],
};
