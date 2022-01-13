import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@fingerlabs/definixswap-uikit-v2'
import useConverter from 'hooks/useConverter'
import BalanceText from 'components/Text/BalanceText'
import CurrencyText from 'components/Text/CurrencyText'

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
  const { convertToPriceFromSymbol } = useConverter()

  const myBalancePrice = useMemo(() => {
    const price = convertToPriceFromSymbol()
    return new BigNumber(myBalance).multipliedBy(price).toNumber()
  }, [myBalance, convertToPriceFromSymbol])

  return (
    <>
      <TitleSection hasMb>{title}</TitleSection>
      <BalanceTextWrap>
        <Flex justifyContent="space-between" alignItems="center">
          {/* <TokenLabel type="token">FINIX</TokenLabel>
          {typeof myBalance === 'number' ? (
            <BalanceText value={myBalance} className="balance-text" />
          ) : (
            <Text className="balance-text">-</Text>
          )} */}
          <Box>
            <BalanceText value={myBalance} className="balance-text" />
            <PriceText value={myBalancePrice} prefix="=" />
          </Box>
        </Flex>
      </BalanceTextWrap>
    </>
  )
}

export default MyBalanceSection
