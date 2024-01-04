import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { QuoteToken } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import useConverter from 'hooks/useConverter'
import { Flex, Text, Label, Box, Coin } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'
import { useTranslation } from 'react-i18next'
import BalanceText from 'components/Text/BalanceText'

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
      <TitleSection hasMb>{title}</TitleSection>
      <BalanceTextWrap>
        <Flex alignItems="flex-end">
          <StyledBalanceText value={totalStakedValue} toFixed={0} />
          <TokenNameText>{tokenName}</TokenNameText>
        </Flex>
      </BalanceTextWrap>
      <PriceText value={totalStakedPrice} prefix="=" />
    </>
  )
}

const MyBalanceSection: React.FC<{
  title: string
  tokenName: string
  myBalance: BigNumber | null
}> = ({ title, tokenName, myBalance }) => {
  return (
    <>
      <TitleSection hasMb>{title}</TitleSection>
      <BalanceTextWrap>
        <Flex alignItems="center">
          <TokenLabel type="token">{tokenName}</TokenLabel>
          {BigNumber.isBigNumber(myBalance) ? (
            <StyledBalanceText value={myBalance.toNumber()} />
          ) : (
            <Text className="balance-text">-</Text>
          )}
        </Flex>
      </BalanceTextWrap>
    </>
  )
}

const EarningsSection: React.FC<{
  title: string
  earnings: BigNumber
}> = ({ earnings }) => {
  const { t } = useTranslation()

  const earningsValue = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])

  return (
    <Wrap>
      <TitleWrap>
        <TitleSection hasMb={false}>{t('Earned')}</TitleSection>
        <Box>
          <Coin symbol="FINIX" size="20px" />
        </Box>
      </TitleWrap>
      <ValueWrap>
        <Flex alignItems="flex-end">
          <StyledBalanceText value={earningsValue}></StyledBalanceText>
          <TokenNameText>{QuoteToken.FINIX}</TokenNameText>
        </Flex>
      </ValueWrap>
    </Wrap>
  )
}

export { TotalStakedSection, MyBalanceSection, EarningsSection }

const TitleSection = styled(Text)<{ hasMb: boolean }>`
  margin-right: ${({ theme }) => theme.spacing.S_6}px;
  margin-bottom: ${({ theme, hasMb }) => (hasMb ? theme.spacing.S_8 : 0)}px;
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
const BalanceTextWrap = styled(Box)`
  .balance-text {
    color: ${({ theme }) => theme.colors.black};
    ${({ theme }) => theme.textStyle.R_18M};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_16M};
    }
  }
`
const PriceText = styled(CurrencyText)`
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_14R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
`
const TokenNameText = styled(Text)`
  padding-left: 2px;
  color: ${({ theme }) => theme.colors.deepgrey};
  ${({ theme }) => theme.textStyle.R_12M};
`

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
const StyledBalanceText = styled(BalanceText)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }
  margin-bottom: -3px;
`
