import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { QuoteToken } from 'config/constants/types'
import { getTokenImageUrl } from 'utils/getTokenImage'
import useConverter from 'hooks/useConverter'
import { Flex, Text, Label, Box } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/CurrencyText'
import BalanceText from 'components/BalanceText'

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

const MyBalanceSection: React.FC<{
  title: string
  myBalance: number | null
}> = ({ title, myBalance }) => {
  return (
    <>
      <TitleSection hasMb>{title}</TitleSection>
      <BalanceTextWrap>
        <Flex alignItems="center">
          <TokenLabel type="token">FINIX</TokenLabel>
          {typeof myBalance === 'number' ? (
            <BalanceText value={myBalance} className="balance-text" />
          ) : (
            <Text className="balance-text">-</Text>
          )}
        </Flex>
      </BalanceTextWrap>
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
  padding-bottom: 1px;
  color: ${({ theme }) => theme.colors.deepgrey};
  ${({ theme }) => theme.textStyle.R_12M};
`
const TokenImage = styled.img`
  width: 20px;
  height: auto;
  object-fit: contain;
`
const EarningsSection: React.FC<{
  title: string
  earnings: number
}> = ({ title, earnings }) => {
  const { convertToPriceFromSymbol, convertToPriceFormat } = useConverter()

  // const earningsValue = useMemo(() => {
  //   return getBalanceNumber(earnings)
  // }, [earnings])

  const earningsPrice = useMemo(() => {
    const price = convertToPriceFromSymbol()
    return convertToPriceFormat(new BigNumber(earnings).multipliedBy(price).toNumber())
  }, [earnings, convertToPriceFromSymbol, convertToPriceFormat])

  return (
    <Wrap>
      <TitleWrap>
        <TitleSection hasMb={false}>{title}</TitleSection>
        <Box>
          <TokenImage src={getTokenImageUrl('finix')} alt="finix" />
        </Box>
      </TitleWrap>
      <ValueWrap>
        <BalanceTextWrap>
          <Flex alignItems="end">
            <BalanceText value={earnings} className="balance-text" />
            <TokenNameText>{QuoteToken.FINIX}</TokenNameText>
          </Flex>
        </BalanceTextWrap>
        <PriceText value={earningsPrice} prefix="=" />
      </ValueWrap>
    </Wrap>
  )
}

export { MyBalanceSection, EarningsSection }
