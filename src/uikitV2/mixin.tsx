export default {};
export const pxToRem = (px: number): string => `${px / 16}rem`;
export const hexToRGB = (hex: string, alpha?: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgba(${r}, ${g}, ${b})`;
};
export const rmUnit = (str: string): number => {
  const matchNum = str.match(/\d+/gi);
  return matchNum && matchNum.length > 0 ? +matchNum[0] : 0;
};
