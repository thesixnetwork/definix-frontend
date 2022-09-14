import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
  Card,
  Flex,
  ColorStyles,
  Text,
  Box,
  GradeSilverIcon,
  GradeGoldIcon,
  GradeDiamondIcon,
} from '@fingerlabs/definixswap-uikit-v2'
import BalanceText from 'components/Text/BalanceText'
import { mediaQueries, spacing } from 'uikitV2/base'
import { textStyle } from 'uikitV2/text'

const Wrap = styled(Flex)`
  margin: ${spacing.S_32}px;
  justify-content: space-between;
  align-items: center;
  ${mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
    margin: ${spacing.S_20}px;
  }
`
const HodlImageWrap = styled(Box)`
  width: 44px;
  height: 44px;
  ${mediaQueries.mobileXl} {
    width: 32px;
    height: 32px;
  }
`
const HodlText = styled(Text)`
  margin-left: ${spacing.S_12}px;
  ${textStyle.R_20M};
  color: #fff;
  ${mediaQueries.mobileXl} {
    margin-left: ${spacing.S_8}px;
    ${textStyle.R_18M};
  }
`
const RightSection = styled(Flex)`
  align-items: center;
  ${mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
    margin-top: ${spacing.S_40}px;
  }
`
const TokenName = styled(Box)`
  display: inline-block;
  padding: ${spacing.S_6}px ${spacing.S_16}px;
  border-radius: 16px;
  ${textStyle.R_12R};
  color: #fff;
  background-color: #413343;
`
const ValueSection = styled(Flex)`
  display: inline-flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-left: ${spacing.S_12}px;
  ${mediaQueries.mobileXl} {
    display: flex;
    margin-top: 10px;
    margin-left: 0;
  }
`
const ValueText = styled(BalanceText)`
  ${textStyle.R_23B};
  color: #fff;
`
const UnitText = styled(Text)`
  margin-left: ${spacing.S_6}px;
  margin-bottom: -2px;
  ${textStyle.R_14M};
  color: #fff;
`

const VFinixSummary: React.FC<{
  grade: string
  balance: number
}> = ({ grade, balance }) => {
  const GradeIcon = useMemo(() => {
    const components = {
      silver: GradeSilverIcon,
      gold: GradeGoldIcon,
      diamond: GradeDiamondIcon,
    }
    const Component = components[grade.toLowerCase()]
    return <Component viewBox="0 0 44 44" width="100%" height="100%" />
  }, [grade])

  return (
    <Card cardBg={ColorStyles.DEEPBROWN} mb="S_16">
      <Wrap>
        <Flex alignItems="center" justifyContent="flex-start">
          {grade === '' ? null : <HodlImageWrap>{GradeIcon}</HodlImageWrap>}
          <HodlText>{`${grade} Hodl`}</HodlText>
        </Flex>
        <RightSection>
          <TokenName>vFINIX Balance</TokenName>
          <ValueSection>
            <ValueText value={balance} />
            <UnitText>vFINIX</UnitText>
          </ValueSection>
        </RightSection>
      </Wrap>
    </Card>
  )
}

export default VFinixSummary
