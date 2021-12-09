import React, { useMemo } from 'react'
import styled from 'styled-components'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import useConverter from 'hooks/useConverter'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Flex, Box, Text, ColorStyles } from 'definixswap-uikit-v2'
import ApyButton from './ApyButton'
import { FarmWithStakedValue } from './types'

const ImageBox = styled(Box)`
  &:first-child {
    z-index: 1;
  }
  &:last-child {
    margin-left: -10px;
  }
`
const TokenImage = styled.img<{ isMediumSize: boolean }>`
  width: ${({ isMediumSize }) => (isMediumSize ? 48 : 40)}px;
  height: auto;
  object-fit: contain;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 36px;
  }
`

export interface ExpandableSectionProps {
  farm: FarmWithStakedValue
  lpLabel: string
  size?: string
}

const CardHeading: React.FC<ExpandableSectionProps> = ({ farm, lpLabel, size = 'medium' }) => {
  const { convertToFarmAPRFormat } = useConverter()
  // We assume the token name is coin pair + lp e.g. FINIX-BNB LP, LINK-BNB LP,
  // NAR-FINIX LP. The images should be finix-bnb.svg, link-bnb.svg, nar-finix.svg
  const isMediumSize = useMemo(() => size === 'medium', [size])
  const displayApy = useMemo(() => {
    try {
      return `${convertToFarmAPRFormat(farm.apy)}%`
    } catch (error) {
      return '-'
    }
  }, [convertToFarmAPRFormat, farm.apy])
  const addLiquidityUrl = useMemo(() => {
    const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
    const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
    return `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  }, [farm])

  return (
    <Flex position="relative">
      <Flex className="mr-s12" alignItems="center">
        <ImageBox>
          <TokenImage isMediumSize={isMediumSize} src={farm.lpSymbols[0].image} alt={farm.lpSymbols[0].symbol} />
        </ImageBox>
        <ImageBox>
          <TokenImage isMediumSize={isMediumSize} src={farm.lpSymbols[1].image} alt={farm.lpSymbols[1].symbol} />
        </ImageBox>
      </Flex>

      <Flex flexDirection="column">
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>{lpLabel}</Text>

        <Flex alignItems="end">
          <Text textStyle="R_14M" color={ColorStyles.ORANGE} style={{ paddingBottom: '2px' }}>
            APR
          </Text>
          <Text textStyle={isMediumSize ? 'R_20B' : 'R_18B'} color={ColorStyles.ORANGE} style={{ marginLeft: '4px' }}>
            {displayApy}
          </Text>
          <Box style={{ marginLeft: '4px' }}>
            <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} apy={farm.apy} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(CardHeading)
