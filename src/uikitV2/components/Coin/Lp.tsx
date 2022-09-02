import React, { useMemo } from "react";
import styled from "styled-components";
import { space, SpaceProps } from "styled-system";
import { COIN_SYMBOL, COIN_SRCSET, LpProps } from "./types";

export const getTokenImageUrl = (tokenName: COIN_SYMBOL | string) => {
  if (!tokenName) {
    return "";
  }
  try {
    return COIN_SRCSET[tokenName.toUpperCase() as COIN_SYMBOL];
  } catch {
    return null;
  }
};

const StyledCoinImage = styled.img<SpaceProps>`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.circle};
  :nth-child(1) {
    z-index: 1;
  }
  :nth-child(2) {
    margin-left: -10px;
    z-index: 0;
  }
  ${space}
`;

const StyledEmpty = styled.div<{ width: string; height: string }>`
  width: ${({ width }) => (width ? width : "auto")};
  height: ${({ height }) => (height ? height : "auto")};
`;

const StyledWrap = styled.div``;

const Lp: React.FC<LpProps> = ({ lpSymbols, size, ...props }) => {
  const [symbol1, symbol2] = lpSymbols;
  const symbol1Url = getTokenImageUrl(symbol1);
  const symbol2Url = getTokenImageUrl(symbol2);
  return symbol1Url && symbol2Url ? (
    <StyledWrap>
      <StyledCoinImage
        width={size}
        height={size}
        src={symbol1Url[0]}
        srcSet={`${symbol1Url[1]} 2x, ${symbol1Url[2]} 3x`}
        alt={symbol1}
        {...props}
      />
      <StyledCoinImage
        width={size}
        height={size}
        src={symbol2Url[0]}
        srcSet={`${symbol2Url[1]} 2x, ${symbol2Url[2]} 3x`}
        alt={symbol2}
        {...props}
      />
    </StyledWrap>
  ) : (
    <StyledEmpty width={size as string} height={size as string} />
  );
};

Lp.defaultProps = {
  size: "20px",
};

export default Lp;
