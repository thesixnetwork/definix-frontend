import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Label, Box } from '@fingerlabs/definixswap-uikit-v2'
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

export default MyBalanceSection
