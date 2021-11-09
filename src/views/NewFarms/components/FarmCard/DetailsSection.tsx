import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
// import styled from 'styled-components'
// import { Text, Heading } from 'uikit-dev'
// import useTokenBalance from 'hooks/useTokenBalance'
// import { getFinixAddress, getWklayAddress } from 'utils/addressHelpers'
// import { getBalanceNumber } from 'utils/formatBalance'
// import { usePriceFinixKusdt } from 'state/hooks'
import { Flex, Text, ColorStyles, Label } from 'definixswap-uikit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useConverter from 'hooks/useConverter'

// export interface ExpandableSectionProps {
//   isHorizontal?: boolean
//   className?: string
//   removed?: boolean
//   totalLiquidityUSD?: string
// }

// const DetailsSection: React.FC<ExpandableSectionProps> = ({
//   removed,
//   totalLiquidityUSD,
//   isHorizontal = false,
//   className = '',
// }) => {
//   const TranslateString = useI18n()
//   // const finixBalance = useTokenBalance(getFinixAddress())
//   // const klayBalance = useTokenBalance(getWklayAddress())
//   // console.log('finix balance: ', finixBalance, new BigNumber(getBalanceNumber(finixBalance)).multipliedBy(usePriceFinixKusdt()).toNumber());
//   // console.log('klay balance: ', klayBalance);

//   return (
//     <Wrapper isHorizontal={isHorizontal} className={className}>
//       {!removed && (
//         <>
//           <Text color="textSubtle">{TranslateString(23, 'Total Liquidity')}</Text>
//           <Heading fontSize="20px !important" textAlign="left" color="text" className="col-6 pr-3">
//             {totalLiquidityUSD}
//           </Heading>
//         </>
//       )}
//     </Wrapper>
//   )
// }

const TotalLiquiditySection: React.FC<{
  title: string
  tokenName: string
  totalLiquidity: BigNumber
}> = ({ title, tokenName, totalLiquidity }) => {
  const { convertToUSD } = useConverter()

  const totalLiquidityPrice = useMemo(() => {
    return convertToUSD(totalLiquidity)
  }, [convertToUSD, totalLiquidity])

  return (
    <>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
        {title}
      </Text>
      <Text color={ColorStyles.BLACK} textStyle="R_18M">
        {totalLiquidityPrice}
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
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
        {title}
      </Text>
      {/* <Flex alignItems="center">
        <Label type="token">{tokenName}</Label>
        <Text color={ColorStyles.BLACK} textStyle="R_18M" style={{ paddingLeft: '2px' }}>
          {balanceValue}
        </Text>
      </Flex> */}
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
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
        {title}
      </Text>
      <Flex alignItems="end">
        <Text color={ColorStyles.BLACK} textStyle="R_18M">
          {earningsValue.toLocaleString()}
        </Text>
        <Text color={ColorStyles.DEEPGREY} textStyle="R_12M" style={{ paddingLeft: '2px' }}>
          FINIX
        </Text>
      </Flex>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
        = {earningsPrice}
      </Text>
    </>
  )
}

export { TotalLiquiditySection, MyBalanceSection, EarningsSection }
