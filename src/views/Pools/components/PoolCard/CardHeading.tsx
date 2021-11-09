import useI18n from 'hooks/useI18n'
import React, { useMemo } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import { Flex, Box, Image, Text, ColorStyles } from 'definixswap-uikit'
import ApyButton from './ApyButton'
import { CardHeadingProps } from './types'

const CardHeading: React.FC<CardHeadingProps> = ({ tokenName, isOldSyrup, apy }) => {
  const TranslateString = useI18n()

  const finixPrice = usePriceFinixUsd()
  const displayApy = useMemo(() => {
    const value = apy.toNumber()
    if (Number.isNaN(value)) {
      return ''
    }
    return `${apy.toNumber().toFixed(2)}%`
  }, [apy])

  return (
    <Flex position="relative">
      <Box width={48} className="mr-s12">
        <Image src={`/images/coins/${tokenName.toLowerCase()}.png`} width={48} height={48} />
      </Box>

      <Flex flexDirection="column">
        <Text textStyle="R_20M">
          {isOldSyrup && '[OLD]'} {tokenName}
        </Text>

        <Flex alignItems="end">
          <Text textStyle="R_14M" color={ColorStyles.RED} style={{ paddingBottom: '2px' }}>
            APR
          </Text>
          <Text textStyle="R_20B" color={ColorStyles.RED} style={{ marginLeft: '4px' }}>
            {displayApy}
          </Text>
          <ApyButton lpLabel={tokenName} finixPrice={finixPrice} apy={apy} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CardHeading
