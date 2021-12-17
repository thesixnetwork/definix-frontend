import React from 'react'
import styled from 'styled-components'
// import useConverter from 'hooks/useConverter'
import { Flex, Box, Text, Coin } from '@fingerlabs/definixswap-uikit-v2'
// import ApyButton from './ApyButton'

const StyledCoin = styled(Coin)`
  width: 40px;
  height: auto;
  object-fit: contain;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 36px;
  }
`

const MainInfoSection: React.FC = () => {
  // const { convertToPoolAPRFormat } = useConverter()
  // const displayApy = useMemo(() => {
  //   try {
  //     return `${convertToPoolAPRFormat(apy)}%`
  //   } catch (error) {
  //     return '-'
  //   }
  // }, [convertToPoolAPRFormat, apy])

  return (
    <Flex position="relative" alignItems="center">
      <Box mr="S_12">
        <StyledCoin symbol="VFINIX" size="" />
      </Box>

      <Flex flexDirection="column">
        <Text textStyle="R_18M">Long-term Stake</Text>

        {/* <Flex alignItems="end">
          <Text textStyle="R_14M" color={ColorStyles.ORANGE} style={{ paddingBottom: '2px' }}>
            APR
          </Text>
          <Text textStyle="R_18B" color={ColorStyles.ORANGE} style={{ marginLeft: '4px' }}>
            {displayApy}
          </Text>
        </Flex> */}
      </Flex>
    </Flex>
  )
}

export default MainInfoSection
