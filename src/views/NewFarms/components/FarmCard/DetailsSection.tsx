import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Text, ColorStyles, Label, Image, Box } from 'definixswap-uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { getTokenImageUrl } from 'utils/getTokenImage'
import useConverter from 'hooks/useConverter'

const TitleSection = styled(Text)<{ hasMb: boolean }>`
  margin-right: ${({ theme }) => theme.spacing.S_6}px;
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_12R};
  white-space: nowrap;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-right: 0;
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
  return (
    <>
      <TitleSection hasMb>{title}</TitleSection>
      {Object.entries(myBalances).map(([tokenName, balanceValue]) => (
        <Flex alignItems="center">
          <TokenLabel type="token">{tokenName}</TokenLabel>
          <BalanceText>
            {!balanceValue || balanceValue === null ? '-' : numeral(balanceValue.toNumber()).format('0,0.[000000]')}
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
  const { convertToUSD, convertToPriceFromSymbol, convertToPriceFormat } = useConverter()

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
      justify-content: space-between;
      align-items: center;
    }
  `
  const TitleWrap = styled(Flex)`
    margin-bottom: ${({ theme }) => theme.spacing.S_8}px;
    align-items: flex-start;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-top: ${({ theme }) => theme.spacing.S_20}px;
      margin-bottom: 0;
    }
  `

  return (
    <Wrap>
      <TitleWrap>
        <TitleSection hasMb={false}>{title}</TitleSection>
        <Image src={getTokenImageUrl('finix')} alt="finix" width={20} height={20} />
      </TitleWrap>
      <Box>
        <Flex alignItems="end">
          <BalanceText>{convertToPriceFormat(earningsValue)}</BalanceText>
          <Text color={ColorStyles.DEEPGREY} textStyle="R_12M" style={{ paddingLeft: '2px' }}>
            FINIX
          </Text>
        </Flex>
        <PriceText>= {earningsPrice}</PriceText>
      </Box>
    </Wrap>
  )
}

export { TotalLiquiditySection, MyBalanceSection, EarningsSection }
