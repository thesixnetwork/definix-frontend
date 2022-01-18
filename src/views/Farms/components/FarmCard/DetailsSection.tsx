import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import useConverter from 'hooks/useConverter'
import { Flex, Text, Label, Box, Coin } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'

const TitleSection = styled(Text)<{ hasMb: boolean }>`
  margin-right: ${({ theme }) => theme.spacing.S_6}px;
  margin-bottom: ${({ theme, hasMb }) => (hasMb ? theme.spacing.S_6 : 0)}px;
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_12R};
  white-space: nowrap;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-bottom: ${({ theme, hasMb }) => (hasMb ? theme.spacing.S_6 : 0)}px;
  }
`
const TokenLabel = styled(Label)`
  margin-right: ${({ theme }) => theme.spacing.S_6}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-right: ${({ theme }) => theme.spacing.S_12}px;
  }
`
const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }
`
const TotalLiquidityText = styled(CurrencyText)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }
`
const PriceText = styled(CurrencyText)`
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_14R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
`
const TotalLiquiditySection: React.FC<{
  title: string
  totalLiquidity: number
}> = ({ title, totalLiquidity }) => {
  return (
    <>
      <TitleSection hasMb>{title}</TitleSection>
      <TotalLiquidityText value={totalLiquidity} />
    </>
  )
}

const MyBalanceSection: React.FC<{
  title: string
  myBalances: { [key: string]: BigNumber | null }
}> = ({ title, myBalances }) => {
  const { convertToBalanceFormat } = useConverter()
  return (
    <>
      <TitleSection hasMb>{title}</TitleSection>
      {Object.entries(myBalances).map(([tokenName, balanceValue]) => (
        <Flex alignItems="center">
          <TokenLabel type="token">{tokenName}</TokenLabel>
          <BalanceText>
            {!BigNumber.isBigNumber(balanceValue) ? '-' : convertToBalanceFormat(balanceValue.toNumber())}
          </BalanceText>
        </Flex>
      ))}
    </>
  )
}

const Wrap = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: ${({ theme }) => theme.spacing.S_20}px;
  }
`
const TitleWrap = styled(Flex)`
  margin-bottom: ${({ theme }) => theme.spacing.S_2}px;
  align-items: flex-start;
`
const ValueWrap = styled(Box)`
  margin-top: -2px;
`
const TokenNameText = styled(Text)`
  padding-left: 2px;
  padding-bottom: 2px;
  color: ${({ theme }) => theme.colors.deepgrey};
  ${({ theme }) => theme.textStyle.R_12M};
`
// const TokenImage = styled.img`
//   width: 20px;
//   height: auto;
//   object-fit: contain;
// `
const EarningsSection: React.FC<{
  title: string
  tokenName: string
  earnings: BigNumber
}> = ({ title, tokenName, earnings }) => {
  const { convertToPriceFromSymbol, convertToBalanceFormat } = useConverter()

  const earningsValue = useMemo(() => getBalanceNumber(earnings), [earnings])
  const earningsPrice = useMemo(() => {
    const price = convertToPriceFromSymbol(tokenName)
    return new BigNumber(earningsValue).multipliedBy(price)
  }, [earningsValue, convertToPriceFromSymbol, tokenName])

  return (
    <Wrap>
      <TitleWrap>
        <TitleSection hasMb={false}>{title}</TitleSection>
        <Box>
          <Coin symbol="FINIX" size="20px" />
          {/* <TokenImage src={getTokenImageUrl('finix')} alt="finix" /> */}
        </Box>
      </TitleWrap>
      <ValueWrap>
        <Flex alignItems="flex-end">
          <BalanceText>{convertToBalanceFormat(earningsValue)}</BalanceText>
          <TokenNameText>FINIX</TokenNameText>
        </Flex>
        <PriceText value={earningsPrice} prefix="=" />
      </ValueWrap>
    </Wrap>
  )
}

export { TotalLiquiditySection, MyBalanceSection, EarningsSection }
