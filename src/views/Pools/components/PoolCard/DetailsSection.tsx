import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import { Flex, Text, Box, ColorStyles } from 'definixswap-uikit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import useConverter from 'hooks/useConverter'
import { DetailsSectionProps } from './types'

const DetailsSection: React.FC<DetailsSectionProps> = ({ tokenName, totalStaked, balance, earnings }) => {
  const TranslateString = useI18n()
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()

  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])

  const totalStakedValue = useMemo(() => {
    return getBalanceNumber(totalStaked)
  }, [totalStaked])

  const totalStakedPrice = useMemo(() => {
    return convertToUSD(new BigNumber(totalStakedValue).multipliedBy(price), 2)
  }, [convertToUSD, totalStakedValue, price])

  const balanceValue = useMemo(() => {
    return getFullDisplayBalance(balance)
  }, [balance])

  const earningsValue = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])

  const earningsPrice = useMemo(() => {
    return convertToUSD(new BigNumber(earningsValue).multipliedBy(price), 2)
  }, [earningsValue, price, convertToUSD])

  return (
    <Flex justifyContent="space-between">
      <Box style={{width: '30%'}}>
        <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R">
          Total Staked
        </Text>
        <Text color={ColorStyles.BLACK} textStyle="R_18M">
          {totalStakedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
        <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
          {totalStakedPrice}
        </Text>
      </Box>
      <Box mx={24} style={{width: '35%'}}>
        <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R">
        Balance
        </Text>
        <Text color={ColorStyles.BLACK} textStyle="R_18M">
          {balanceValue}
        </Text>
      </Box>
      <Box style={{width: '35%'}}>
        <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R">
          Total Staked
        </Text>
        <Text color={ColorStyles.BLACK} textStyle="R_18M">
          {earningsValue.toLocaleString()}
        </Text>
        <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
          {earningsPrice}
        </Text>
      </Box>
    </Flex>
  )
}

export default DetailsSection
