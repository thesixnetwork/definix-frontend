import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import { Flex, Text, Box, ColorStyles, Label } from 'definixswap-uikit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import useConverter from 'hooks/useConverter'
import { DetailsSectionProps } from './types'

const TotalStakedSection: React.FC<{
  title: string
  tokenName: string
  totalStaked: BigNumber
}> = ({ title, tokenName, totalStaked }) => {
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

  return (
    <>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R">
        {title}
      </Text>
      <Flex alignItems="center">
        <Text color={ColorStyles.BLACK} textStyle="R_18M">
          {totalStakedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
        <Text color={ColorStyles.DEEPGREY} textStyle="R_12M">
          {tokenName}
        </Text>
      </Flex>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
        {totalStakedPrice}
      </Text>
    </>
  )
}

const MyBalanceSection: React.FC<{
  title: string
  tokenName: string
  balance: BigNumber
}> = ({ title, tokenName, balance }) => {
  const balanceValue = useMemo(() => {
    return getFullDisplayBalance(balance, { fixed: 6 })
  }, [balance])

  return (
    <>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R">
        {title}
      </Text>
      <Flex>
        <Label type="token">{tokenName}</Label>
        <Text color={ColorStyles.BLACK} textStyle="R_18M">
          {balanceValue}
        </Text>
      </Flex>
    </>
  )
}

const EarningsSection: React.FC<{
  title: string
  tokenName: string
  earnings: BigNumber
}> = ({ title, tokenName, earnings }) => {
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()

  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])

  const earningsValue = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])

  const earningsPrice = useMemo(() => {
    return convertToUSD(new BigNumber(earningsValue).multipliedBy(price), 2)
  }, [earningsValue, price, convertToUSD])

  return (
    <>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R">
          {title}
        </Text>
        <Flex alignItems="center">
          <Text color={ColorStyles.BLACK} textStyle="R_18M">
            {earningsValue.toLocaleString()}
          </Text>
          <Text color={ColorStyles.DEEPGREY} textStyle="R_12M">
            {tokenName}
          </Text>
        </Flex>
        <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
          {earningsPrice}
        </Text>
    </>
  )
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ tokenName, totalStaked, balance, earnings }) => {
  const TranslateString = useI18n()

  return (
    <Flex justifyContent="space-between">
      <Box style={{ width: '22%' }}>
        <TotalStakedSection title="Total Staked" tokenName={tokenName} totalStaked={totalStaked}/>
      </Box>
      <Box mx={24} style={{ width: '34%' }}>
        <MyBalanceSection title="Balance" tokenName={tokenName} balance={balance}/>
      </Box>
      <Box style={{ width: '44%' }}>
        <EarningsSection title="Earned" tokenName={tokenName} earnings={earnings}/>
      </Box>
    </Flex>
  )
}

export default DetailsSection
export {
  TotalStakedSection,
  MyBalanceSection,
  EarningsSection
}
