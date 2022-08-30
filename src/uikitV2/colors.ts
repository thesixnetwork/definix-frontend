import { darken, lighten, rgba } from "polished";
import { hexToRGB } from "./mixin";
/*
:root {
  --01-main-red: #ff5532;
  --02-sub-orange: #ff6828;
  --02-sub-yellow: #fea948;
  --02-sub-green: #02a1a1;
  --03-brownscale-brownscale-01-pale: #dad0c5;
  --03-brownscale-brownscale-02-lightbrown: #b4a9a8;
  --03-brownscale-brownscale-03-brown: #5e515f;
  --03-brownscale-brownscale-04-deepbrown: #413343;
  --04-greyscale-greyscale-01-white: #fff;
  --04-greyscale-greyscale-02-lightgrey: #e0e0e0;
  --04-greyscale-greyscale-03-mediumgrey: #999;
  --04-greyscale-greyscale-04-deepgrey: #666;
  --04-greyscale-greyscale-05-black: #222;
  --05-bg-bg-yellow-02: #ffedcb;
  --05-bg-bg-yellow-01: #fffbf5;
}
*/

export enum ColorStyles {
  RED = "red",
  ORANGE = "orange",
  YELLOW = "yellow",
  GREEN = "green",
  PALE = "pale",
  LIGHTBROWN = "lightbrown",
  BROWN = "brown",
  DEEPBROWN = "deepbrown",
  WHITE = "white",
  LIGHTGREY = "lightgrey",
  MEDIUMGREY = "mediumgrey",
  DEEPGREY = "deepgrey",
  BLACK = "black",
  YELLOWBG2 = "yellowBg2",
  YELLOWBG1 = "yellowBg1",
  LIGHTGREY_20 = "lightGrey20",
  LIGHTGREY_50 = "lightGrey50",
  GREY = "grey",
  LIGHTBROWN_20 = "lightBrown20",
  LIGHTBROWN_50 = "lightBrown50",
  BROWN_30 = "brown30",
  WHITE_30 = "white30",
  LIGHTGREY_30 = "lightGrey30",
  YELLOW_20 = "yellow20",
}

const colorHex = {
  [ColorStyles.RED]: "#ff5532",
  [ColorStyles.ORANGE]: "#ff6828",
  [ColorStyles.YELLOW]: "#fea948",
  [ColorStyles.GREEN]: "#02a1a1",
  [ColorStyles.PALE]: "#dad0c5",
  [ColorStyles.LIGHTBROWN]: "#b4a9a8",
  [ColorStyles.BROWN]: "#5e515f",
  [ColorStyles.DEEPBROWN]: "#413343",
  [ColorStyles.WHITE]: "#ffffff",
  [ColorStyles.LIGHTGREY]: "#e0e0e0",
  [ColorStyles.MEDIUMGREY]: "#999999",
  [ColorStyles.DEEPGREY]: "#666666",
  [ColorStyles.BLACK]: "#222222",
  [ColorStyles.YELLOWBG2]: "#ffedcb",
  [ColorStyles.YELLOWBG1]: "#fffbf5",
  [ColorStyles.GREY]: "#cccccc",
};

export const baseColors = {
  ...colorHex,
  backgroundFooter: colorHex.white,
  backgroundHeader: colorHex.white,
  backgroundSideMenu: colorHex.white,
  border: hexToRGB(colorHex.lightgrey, 0.5),
  card: colorHex.white,
  cardFooter: colorHex.white,
  connectBtnBorder: colorHex.white,
  failure: colorHex.red,
  input: colorHex.white,
  invertedContrast: colorHex.white,
  networkBtnBorder: colorHex.white,
  networkBtnInner: colorHex.white,
  placeholder: colorHex.mediumgrey,
  primary: colorHex.red,
  primaryBright: lighten(0.1, colorHex.red),
  primaryDark: darken(0.1, colorHex.red),
  success: colorHex.green,
  successAlpha: hexToRGB(colorHex.green, 0.1),
  text: colorHex.deepgrey,
  textInvert: colorHex.white,
  textSubtle: colorHex.mediumgrey,
  background: colorHex.yellowBg2,
  backgroundBlueGradient: "linear-gradient(#0D418E #349BE7)",
  backgroundBox: rgba("#babfc7", 0.12),
  backgroundDisabled: rgba(colorHex.lightgrey, 0.2),
  connectBtnInner: "#8C90A5",
  contrast: colorHex.black,
  secondary: colorHex.green,
  tertiary: colorHex.yellow,
  textDisabled: colorHex.lightgrey,
  warning: colorHex.red,
  black20: hexToRGB(colorHex.black, 0.2),
  black30: hexToRGB(colorHex.black, 0.3),
  white80: hexToRGB(colorHex.white, 0.8),
  brown30: hexToRGB(colorHex.brown, 0.3),
  yellow20: hexToRGB(colorHex.yellow, 0.2),
};

export const brandColors = {
  binance: "#F0B90B",
  klaytn: "#4F463C",
};

export const customColors = {
  [ColorStyles.LIGHTGREY_20]: hexToRGB(baseColors[ColorStyles.LIGHTGREY], 0.2),
  [ColorStyles.LIGHTGREY_30]: hexToRGB(baseColors[ColorStyles.LIGHTGREY], 0.3),
  [ColorStyles.YELLOW_20]: hexToRGB(baseColors[ColorStyles.YELLOW], 0.2),
  [ColorStyles.LIGHTGREY_50]: hexToRGB(baseColors[ColorStyles.LIGHTGREY], 0.5),
  [ColorStyles.LIGHTBROWN_20]: hexToRGB(baseColors[ColorStyles.LIGHTBROWN], 0.2),
  [ColorStyles.LIGHTBROWN_50]: hexToRGB(baseColors[ColorStyles.LIGHTBROWN], 0.5),
  [ColorStyles.BROWN_30]: hexToRGB(baseColors[ColorStyles.BROWN], 0.3),
  [ColorStyles.WHITE_30]: hexToRGB(baseColors[ColorStyles.WHITE], 0.3),
};

export const lightColors = {
  ...baseColors,
  ...brandColors,
  ...customColors,
};

export const darkColors = {
  ...baseColors,
  ...brandColors,
  ...customColors,
};
export default {};
