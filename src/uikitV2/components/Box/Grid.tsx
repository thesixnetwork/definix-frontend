import styled from "styled-components";
import { background, border, layout, position, space, color, grid } from "styled-system";
import { getVariantTextStyle } from "../../text";
import Box from "./Box";
import { GridComponentProps } from "./types";

const Grid = styled(Box)<GridComponentProps>`
  display: grid;
  ${background}
  ${color}
  ${border}
  ${layout}
  ${position}
  ${space}
  ${grid}
  ${getVariantTextStyle()}
`;

export default Grid;
