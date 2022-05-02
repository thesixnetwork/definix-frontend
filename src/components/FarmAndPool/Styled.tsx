import { Text } from "@fingerlabs/definixswap-uikit-v2";
import BalanceText from "components/Text/BalanceText";
import CurrencyText from "components/Text/CurrencyText";
import styled from "styled-components";

export const TitleSection = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.S_8}px;
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_12R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-bottom: ${({ theme }) => theme.spacing.S_6}px;
  }
`
export const StyledBalanceText = styled(BalanceText)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  margin-bottom: -3px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }

  .unit {
    ${({ theme }) => theme.textStyle.R_12M};
    color: ${({ theme }) => theme.colors.deepgrey};
  }
`

export const PriceText = styled(CurrencyText)`
  margin-top: 3px;
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_14R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
`
