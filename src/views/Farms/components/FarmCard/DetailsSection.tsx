import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Label, Box, Coin } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'
import { QuoteToken } from 'config/constants/types'
import { useTranslation } from 'react-i18next'
import BalanceText from 'components/Text/BalanceText'

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
  return (
    <>
      <TitleSection hasMb>{title}</TitleSection>
      {Object.entries(myBalances).map(([tokenName, balanceValue], index) => (
        <Flex alignItems="center" key={index}>
          <TokenLabel type="token">{tokenName}</TokenLabel>
          <StyledBalanceText value={balanceValue} toFixed={0} />
        </Flex>
      ))}
    </>
  )
}


const EarningsSection: React.FC<{
  allEarnings: {
    token: QuoteToken
    earnings: number
  }[]
}> = ({ allEarnings }) => {
  const { t } = useTranslation()
      
  return (
    <Wrap>
      <TitleWrap>
        <TitleSection hasMb={false}>{t('Earned')}</TitleSection>
        <Box>
          {
            allEarnings.length > 0 && allEarnings.map(({ token }, index) => <Coin key={index} symbol={token} size="20px" />)
          }
        </Box>
      </TitleWrap>
      <ValueWrap>
        {
          allEarnings.length > 0 && allEarnings.map(({ token, earnings }, index) => <Flex key={index} alignItems="flex-end">
            <StyledBalanceText value={earnings} />
            {/* <BalanceText>{convertToBalanceFormat(earnings)}</BalanceText> */}
            <TokenNameText>{token || ''}</TokenNameText>
          </Flex>)
        }
      </ValueWrap>
    </Wrap>
  )
}

export { TotalLiquiditySection, MyBalanceSection, EarningsSection }

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
const StyledBalanceText = styled(BalanceText)`
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