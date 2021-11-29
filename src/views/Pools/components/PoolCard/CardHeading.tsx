import React, { useMemo } from 'react'
import { getTokenImageUrl } from 'utils/getTokenImage'
import useConverter from 'hooks/useConverter'
import { Flex, Box, Image, Text, ColorStyles } from 'definixswap-uikit'
import ApyButton from './ApyButton'
import { CardHeadingProps } from './types'

const CardHeading: React.FC<CardHeadingProps> = ({ tokenName, isOldSyrup, apy, size = 'medium' }) => {
  const { convertToPoolAPRFormat } = useConverter()
  const isMediumSize = useMemo(() => size === 'medium', [size])
  const displayApy = useMemo(() => {
    try {
      return `${convertToPoolAPRFormat(apy)}%`
    } catch (error) {
      return '-'
    }
  }, [convertToPoolAPRFormat, apy])
  const imageSize = useMemo(() => (isMediumSize ? 48 : 40), [isMediumSize])

  return (
    <Flex position="relative" alignItems="center">
      <Box width={imageSize} className="mr-s12">
        <Image src={getTokenImageUrl(tokenName)} width={imageSize} height={imageSize} />
      </Box>

      <Flex flexDirection="column">
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>
          {isOldSyrup && '[OLD]'} {tokenName}
        </Text>

        <Flex alignItems="end">
          <Text textStyle="R_14M" color={ColorStyles.ORANGE} style={{ paddingBottom: '2px' }}>
            APR
          </Text>
          <Text textStyle={isMediumSize ? 'R_20B' : 'R_18B'} color={ColorStyles.ORANGE} style={{ marginLeft: '4px' }}>
            {displayApy}
          </Text>
          <Box style={{ marginLeft: '4px' }}>
            <ApyButton lpLabel={tokenName} apy={apy} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CardHeading
