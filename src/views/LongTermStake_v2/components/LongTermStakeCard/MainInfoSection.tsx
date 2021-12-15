import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getTokenImageUrl } from 'utils/getTokenImage'
import useConverter from 'hooks/useConverter'
import { Flex, Box, Text, ColorStyles } from 'definixswap-uikit-v2'
// import ApyButton from './ApyButton'
// import { CardHeadingProps } from './types'

const TokenImage = styled.img`
  width: 40px;
  height: auto;
  object-fit: contain;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 36px;
  }
`

const MainInfoSection: React.FC = () => {
  const { convertToPoolAPRFormat } = useConverter()
  // const displayApy = useMemo(() => {
  //   try {
  //     return `${convertToPoolAPRFormat(pool.apy)}%`
  //   } catch (error) {
  //     return '-'
  //   }
  // }, [convertToPoolAPRFormat, pool.apy])

  return (
    <Flex position="relative" alignItems="center">
      <Box mr="S_12">
        <TokenImage src={getTokenImageUrl('finix')} alt='finix' />
      </Box>

      <Flex flexDirection="column">
        <Text textStyle="R_18M">
          Long-term Stake
        </Text>

        <Flex alignItems="end">
          <Text textStyle="R_14M" color={ColorStyles.ORANGE} style={{ paddingBottom: '2px' }}>
            APR
          </Text>
          <Text textStyle="R_18B" color={ColorStyles.ORANGE} style={{ marginLeft: '4px' }}>
            200%
          </Text>
          <Box style={{ marginLeft: '4px' }}>
            {/* <ApyButton lpLabel={pool.tokenName} apy={pool.apy} /> */}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MainInfoSection
