import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getTokenImageUrl } from 'utils/getTokenImage'
import useConverter from 'hooks/useConverter'
import { Flex, Box, Text, ColorStyles } from 'definixswap-uikit'
import ApyButton from './ApyButton'
import { CardHeadingProps } from './types'

const TokenImage = styled.img<{ isMediumSize: boolean }>`
  width: ${({ isMediumSize }) => (isMediumSize ? 48 : 40)}px;
  height: auto;
  object-fit: contain;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 36px;
  }
`

const CardHeading: React.FC<CardHeadingProps> = ({ isOldSyrup, pool, size = 'medium' }) => {
  const { convertToPoolAPRFormat } = useConverter()
  const isMediumSize = useMemo(() => size === 'medium', [size])
  const displayApy = useMemo(() => {
    try {
      return `${convertToPoolAPRFormat(pool.apy)}%`
    } catch (error) {
      return '-'
    }
  }, [convertToPoolAPRFormat, pool.apy])

  return (
    <Flex position="relative" alignItems="center">
      <Box mr="S_12">
        <TokenImage isMediumSize={isMediumSize} src={getTokenImageUrl(pool.tokenName)} alt={pool.tokenName} />
      </Box>

      <Flex flexDirection="column">
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>
          {isOldSyrup && '[OLD]'} {pool.tokenName}
        </Text>

        <Flex alignItems="end">
          <Text textStyle="R_14M" color={ColorStyles.ORANGE} style={{ paddingBottom: '2px' }}>
            APR
          </Text>
          <Text textStyle={isMediumSize ? 'R_20B' : 'R_18B'} color={ColorStyles.ORANGE} style={{ marginLeft: '4px' }}>
            {displayApy}
          </Text>
          <Box style={{ marginLeft: '4px' }}>
            <ApyButton lpLabel={pool.tokenName} apy={pool.apy} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CardHeading
