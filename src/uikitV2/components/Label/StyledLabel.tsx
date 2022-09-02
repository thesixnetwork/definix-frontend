import styled, { DefaultTheme } from "styled-components";
import { space, backgroundColor, color } from "styled-system";
import { LabelProps, labelTypes } from "./types";
import { get } from "lodash";
import { ColorStyles, lightColors } from "../../colors";

interface StyledLabel {
  theme: DefaultTheme;
}
interface TypeSet {
  width: string;
  height: string;
  backgroundColor: string;
  fontWeight: string;
}

const dataPerType: { [key: string]: TypeSet } = {
  noti: {
    width: "72px",
    height: "24px",
    backgroundColor: lightColors[ColorStyles.YELLOW],
    fontWeight: "bold",
  },
  token: {
    width: "58px",
    height: "20px",
    backgroundColor: lightColors[ColorStyles.LIGHTBROWN],
    fontWeight: "normal",
  },
};

const getTypeSet = (type: string = labelTypes.NOTI): TypeSet => get(dataPerType, type);
const getData =
  (key: string) =>
  ({ type }: LabelProps): string => {
    return get(getTypeSet(type), key);
  };

export const StyledLabel = styled.div<LabelProps>`
  width: ${getData("width")};
  height: ${getData("height")};
  border-radius: 12px;
  font-size: 12px;
  font-weight: ${getData("fontWeight")};
  line-height: ${getData("height")};
  text-align: center;
  background-color: ${getData("backgroundColor")};
  color: ${lightColors[ColorStyles.WHITE]};

  ${space}
  ${color}
`;
