import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import { Flex, Text } from 'definixswap-uikit'
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
    return convertToUSD(new BigNumber(totalStakedValue).multipliedBy(price), 0)
  }, [convertToUSD, totalStakedValue, price])

  const balanceValue = useMemo(() => {
    return getFullDisplayBalance(balance)
  }, [balance])

  const earningsValue = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])

  const earningsPrice = useMemo(() => {
    return convertToUSD(new BigNumber(earningsValue).multipliedBy(price), 0)
  }, [earningsValue, price, convertToUSD])

  return (
    <Flex justifyContent="space-between">
      <div style={{ marginRight: '30px' }}>
        <Text color="textSubtle">
          Total Staked: {totalStakedValue.toLocaleString()} = {totalStakedPrice}
        </Text>
      </div>
      <div style={{ marginRight: '30px' }}>
        <Text color="textSubtle">Balance: {balanceValue}</Text>
      </div>
      <div>
        <Text color="textSubtle">
          Earned: {earningsValue.toLocaleString()} = {earningsPrice}
        </Text>
      </div>
    </Flex>
  )
}

export default DetailsSection
