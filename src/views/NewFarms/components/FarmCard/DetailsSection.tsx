import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Text, Label, Image, Box } from 'definixswap-uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { getTokenImageUrl } from 'utils/getTokenImage'
import useConverter from 'hooks/useConverter'

const TitleSection = styled(Text)<{ hasMb: boolean }>`
  margin-right: ${({ theme }) => theme.spacing.S_6}px;
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
const PriceText = styled(Text)`
  color: ${({ theme }) => theme.colors.deepgrey};
  ${({ theme }) => theme.textStyle.R_14R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
`

const TotalLiquiditySection: React.FC<{
  title: string
  totalLiquidity: number
}> = ({ title, totalLiquidity }) => {
  const { convertToUSD } = useConverter()

  const totalLiquidityPrice = useMemo(() => {
    return convertToUSD(totalLiquidity)
  }, [convertToUSD, totalLiquidity])

  return (
    <>
      <TitleSection hasMb>{title}</TitleSection>
      <BalanceText>{totalLiquidityPrice}</BalanceText>
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
            {!balanceValue || balanceValue === null ? '-' : convertToBalanceFormat(balanceValue.toNumber())}
          </BalanceText>
        </Flex>
      ))}
    </>
  )
}

const EarningsSection: React.FC<{
  title: string
  tokenName: string
  earnings: BigNumber
}> = ({ title, tokenName, earnings }) => {
  const { convertToUSD, convertToPriceFromSymbol, convertToBalanceFormat, convertToPriceFormat } = useConverter()

  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])

  const earningsValue = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])

  const earningsPrice = useMemo(() => {
    return convertToUSD(new BigNumber(earningsValue).multipliedBy(price), 2)
  }, [earningsValue, price, convertToUSD])

  const Wrap = styled(Flex)`
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: row;
      align-items: flex-start;
      margin-top: ${({ theme }) => theme.spacing.S_20}px;
    }
  `
  const TitleWrap = styled(Flex)`
    margin-bottom: ${({ theme }) => theme.spacing.S_2}px;
    align-items: flex-start;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-bottom: 0;
      margin-right: ${({ theme }) => theme.spacing.S_28}px;
    }
  `
  const ValueWrap = styled(Box)`
    margin-top: -2px;
  `
  const TokenNameText = styled(Text)`
    padding-left: 2px;
    padding-bottom: 1px;
    color: ${({ theme }) => theme.colors.deepgrey};
    ${({ theme }) => theme.textStyle.R_12M};
  `

  return (
    <Wrap>
      <TitleWrap>
        <TitleSection hasMb={false}>{title}</TitleSection>
        <Box width={20}>
          <Image src={getTokenImageUrl('finix')} alt="finix" width={20} height={20} />
        </Box>
      </TitleWrap>
      <ValueWrap>
        <Flex alignItems="end">
          <BalanceText>{convertToBalanceFormat(earningsValue)}</BalanceText>
          <TokenNameText>FINIX</TokenNameText>
        </Flex>
        <PriceText>= {earningsPrice}</PriceText>
      </ValueWrap>
    </Wrap>
  )
}

export { TotalLiquiditySection, MyBalanceSection, EarningsSection }
