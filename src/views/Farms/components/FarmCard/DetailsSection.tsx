import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import useConverter from 'hooks/useConverter'
import { Flex, Text, Label, Box, Coin } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'
import { FarmWithStakedValue } from './types'
import { QuoteToken } from 'config/constants/types'
import { useTranslation } from 'react-i18next'

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
      {Object.entries(myBalances).map(([tokenName, balanceValue], index) => (
        <Flex alignItems="center" key={index}>
          <TokenLabel type="token">{tokenName}</TokenLabel>
          <BalanceText>
            {!BigNumber.isBigNumber(balanceValue) ? '-' : convertToBalanceFormat(balanceValue.toNumber())}
          </BalanceText>
        </Flex>
      ))}
    </>
  )
}


const EarningsSection: React.FC<{
  pendingRewards: any[];
  isBundle: boolean;
  bundleRewards: any;
  earnings: BigNumber
}> = ({ isBundle, bundleRewards, earnings, pendingRewards }) => {
  const { t } = useTranslation()
  const { convertToBalanceFormat } = useConverter()

  const earningsValue = useMemo(() => getBalanceNumber(earnings), [earnings])
  const rewardValues = useMemo(() => {
    if (pendingRewards.length > 0) {
      return pendingRewards.reduce((acc, { bundleId, reward }) => {
        acc[bundleId] = getBalanceNumber(reward)
        return acc;
      }, [])
    }
    return []
  }, [pendingRewards])
      
  return (
    <Wrap>
      <TitleWrap>
        <TitleSection hasMb={false}>{t('Earned')}</TitleSection>
        <Box>
          {
            isBundle && bundleRewards.map((bundle, index) => <Coin key={index} symbol={bundle.rewardTokenInfo.name} size="20px" />)
          }
          <Coin symbol={QuoteToken.FINIX} size="20px" />
        </Box>
      </TitleWrap>
      <ValueWrap>
        {
          isBundle && bundleRewards.map((bundle, bundleId) => <Flex key={bundleId} alignItems="flex-end">
            <BalanceText>{convertToBalanceFormat(rewardValues[bundleId])}</BalanceText>
            <TokenNameText>{bundle.rewardTokenInfo.name || ''}</TokenNameText>
          </Flex>)
        }
        <Flex alignItems="flex-end">
          <BalanceText>{convertToBalanceFormat(earningsValue)}</BalanceText>
          <TokenNameText>FINIX</TokenNameText>
        </Flex>
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