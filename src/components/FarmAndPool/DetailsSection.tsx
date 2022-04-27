import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Text, Label, Box, Coin } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'
import { QuoteToken } from 'config/constants/types'
import { useTranslation } from 'react-i18next'
import BalanceText from 'components/Text/BalanceText'
import useConverter from 'hooks/useConverter'
import { getBalanceNumber } from 'utils/formatBalance'
import { TitleSection } from './Styled'

const TotalLiquiditySection: React.FC<{
  title: string
  totalLiquidity: number
}> = ({ title, totalLiquidity }) => {
  return (
    <>
      <TitleSection>{title}</TitleSection>
      <TotalLiquidityText value={totalLiquidity} />
    </>
  )
}

const TotalStakedSection: React.FC<{
  title: string
  tokenName: string
  totalStaked: BigNumber
}> = ({ title, tokenName, totalStaked }) => {
  const { convertToPriceFromSymbol, convertToPriceFormat } = useConverter()

  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])

  const totalStakedValue = useMemo(() => {
    return getBalanceNumber(totalStaked)
  }, [totalStaked])

  const totalStakedPrice = useMemo(() => {
    return new BigNumber(totalStakedValue).multipliedBy(price).toNumber()
  }, [convertToPriceFormat, totalStakedValue, price])

  return (
    <>
      <TitleSection>{title}</TitleSection>
      <Box>
        <Flex alignItems="flex-end">
          <StyledBalanceText value={totalStakedValue} toFixed={0} />
          <UnitText>{tokenName}</UnitText>
        </Flex>
        <PriceText value={totalStakedPrice} prefix="=" />
      </Box>
    </>
  )
}


const MyBalanceSection: React.FC<{
  title: string
  myBalances: { [key: string]: BigNumber | null }
}> = ({ title, myBalances }) => {
  return (
    <>
      <TitleSection>{title}</TitleSection>
      {Object.entries(myBalances).map(([tokenName, balanceValue], index) => (
        <Flex alignItems="center" mb="2px" key={index}>
          <TokenLabel type="token">{tokenName}</TokenLabel>
          <StyledBalanceText value={balanceValue || 0} toFixed={0} />
        </Flex>
      ))}
    </>
  )
}


const EarningsSection: React.FC<{
  allEarnings: {
    symbol: QuoteToken
    earnings: number
  }[]
  isMobile: boolean
}> = ({ allEarnings, isMobile }) => {
  const { t } = useTranslation()
      
  return (
    <Wrap>
      <StyledTitleSection>
        <span>{t('Earned')}</span>
        <Flex ml="8px">
          {
            allEarnings.length > 0 && allEarnings.map(({ symbol }, index) => 
              <ImageBox key={index} width={isMobile ? '16px' : '20px'} height={isMobile ? '16px' : '20px'}>
                <Coin symbol={symbol} size="100%" />
              </ImageBox>
            )
          }
        </Flex>
      </StyledTitleSection>
      <ValueWrap>
        {
          allEarnings.length > 0 && allEarnings.map(({ symbol, earnings }, index) => <Flex key={index} alignItems="flex-end">
            <StyledBalanceText value={earnings} />
            <TokenNameText>{symbol || ''}</TokenNameText>
          </Flex>)
        }
      </ValueWrap>
    </Wrap>
  )
}

export { TotalLiquiditySection, TotalStakedSection, MyBalanceSection, EarningsSection }

const ImageBox = styled(Box)`
  &:first-child {
    z-index: 1;
  }
  &:last-child {
    margin-left: -4px;
  }
`

const StyledTitleSection = styled(TitleSection)`
  display: flex;
  align-items: center;
`


// const TitleSection = styled(Text)<{ hasMb: boolean }>`
//   margin-right: ${({ theme }) => theme.spacing.S_6}px;
//   margin-bottom: ${({ theme, hasMb }) => (hasMb ? theme.spacing.S_6 : 0)}px;
//   color: ${({ theme }) => theme.colors.mediumgrey};
//   ${({ theme }) => theme.textStyle.R_12R};
//   white-space: nowrap;
//   ${({ theme }) => theme.mediaQueries.mobileXl} {
//     margin-bottom: ${({ theme, hasMb }) => (hasMb ? theme.spacing.S_6 : 0)}px;
//   }
// `
const TokenLabel = styled(Label)`
  margin-right: ${({ theme }) => theme.spacing.S_6}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-right: ${({ theme }) => theme.spacing.S_12}px;
  }
`
const StyledBalanceText = styled(BalanceText)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }
  margin-bottom: -3px;
`
const TotalLiquidityText = styled(CurrencyText)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }
`

const Wrap = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: ${({ theme }) => theme.spacing.S_20}px;
  }
`
const TitleWrap = styled(Flex)`
  margin-bottom: ${({ theme }) => theme.spacing.S_2}px;
  align-items: center;
`
const ValueWrap = styled(Box)`
  margin-top: -2px;
`
const TokenNameText = styled(Text)`
  padding-left: 2px;
  color: ${({ theme }) => theme.colors.deepgrey};
  ${({ theme }) => theme.textStyle.R_12M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-bottom: -1px;
  }
`

const UnitText = styled(Text)`
  margin-left: 4px;
  ${({ theme }) => theme.textStyle.R_12M};
  color: ${({ theme }) => theme.colors.deepgrey};
  line-height: 1.9;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    line-height: 1.8;
  }
`

const PriceText = styled(CurrencyText)`
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_14R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
`