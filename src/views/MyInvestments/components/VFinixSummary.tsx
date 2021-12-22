import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Card, Flex, ColorStyles, Text, Box, GradeSilverIcon, GradeGoldIcon, GradeDiamondIcon } from '@fingerlabs/definixswap-uikit-v2'
import BalanceText from 'components/BalanceText'

const Wrap = styled(Flex)`
  margin: ${({ theme }) => theme.spacing.S_32}px;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
    margin: ${({ theme }) => theme.spacing.S_20}px;
  }
`
const HodlImageWrap = styled(Box)`
  height: 44px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    height: 32px;
  }
`
const HodlText = styled(Text)`
  margin-left: ${({ theme }) => theme.spacing.S_12}px;
  ${({ theme }) => theme.textStyle.R_20M};
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-left: ${({ theme }) => theme.spacing.S_8}px;
    ${({ theme }) => theme.textStyle.R_18M};
  }
`
const RightSection = styled(Flex)`
  align-items: center;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
    margin-top: ${({ theme }) => theme.spacing.S_40}px;
  }
`
const TokenName = styled(Box)`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.S_6}px ${({ theme }) => theme.spacing.S_16}px;
  border-radius: 16px;
  ${({ theme }) => theme.textStyle.R_12R};
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.brown};
`
const ValueSection = styled(Flex)`
  display: inline-flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-left: ${({ theme }) => theme.spacing.S_12}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    display: flex;
    margin-top: 10px;
    margin-left: 0;
  }
`
const ValueText = styled(BalanceText)`
  ${({ theme }) => theme.textStyle.R_23B};
  color: ${({ theme }) => theme.colors.white};
`
const UnitText = styled(Text)`
  margin-left: ${({ theme }) => theme.spacing.S_6}px;
  margin-bottom: -2px;
  ${({ theme }) => theme.textStyle.R_14M};
  color: ${({ theme }) => theme.colors.white};
`

const VFinixSummary: React.FC<{
  grade: string
  balance: number
}> = ({ grade, balance }) => {
  const { t } = useTranslation()

  const GradeIcon = useMemo(() => {
    const components = {
      silver: GradeSilverIcon,
      gold: GradeGoldIcon,
      diamond: GradeDiamondIcon
    }
    const Component = components[grade.toLowerCase()]
    return (
      <Component viewBox="0 0 44 44" width="100%" height="100%" />
    )
  }, [grade])


  return (
    <Card cardBg={ColorStyles.DEEPBROWN} mb="S_16">
      <Wrap>
        <Flex alignItems="center">
          {grade === '' ? null : (
            <HodlImageWrap>
              {GradeIcon}
            </HodlImageWrap>
          )}
          <HodlText>{t(`${grade} Hodl`)}</HodlText>
        </Flex>
        <RightSection>
          <TokenName>vFINIX Balance</TokenName>
          <ValueSection>
            <ValueText
              value={balance}
            />
            <UnitText>vFINIX</UnitText>
          </ValueSection>
        </RightSection>
      </Wrap>
    </Card>
  )
}

export default VFinixSummary