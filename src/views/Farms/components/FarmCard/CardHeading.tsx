import React, { useMemo } from 'react'
import styled from 'styled-components'
import useConverter from 'hooks/useConverter'
import { Flex, Box, Text, ColorStyles, Coin } from '@fingerlabs/definixswap-uikit-v2'
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
// const TokenImage = styled.img<{ isMediumSize: boolean }>`
//   width: ${({ isMediumSize }) => (isMediumSize ? 48 : 40)}px;
//   height: auto;
//   object-fit: contain;
//   ${({ theme }) => theme.mediaQueries.mobileXl} {
//     width: 36px;
//   }
// `

const StyledCoin = styled(Coin)`
  width: 40px;
  height: 40px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 36px;
    height: 36px;
  }
`

export interface ExpandableSectionProps {
  farm: FarmWithStakedValue
  lpLabel: string
  size?: string
  addLiquidityUrl?: string
  componentType?: string
}

const CardHeading: React.FC<ExpandableSectionProps> = ({
  farm,
  lpLabel,
  size = 'medium',
  addLiquidityUrl = '',
  componentType,
}) => {
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

  return (
    <Flex position="relative">
      <Flex
        mr={componentType === 'myInvestment' ? 'S_16' : 'S_12'}
        alignItems="center"
        width={componentType === 'myInvestment' ? '70px' : 'auto'}
      >
        <ImageBox>
          <StyledCoin symbol={farm.lpSymbols[0].symbol} size="40px" />
        </ImageBox>
        <ImageBox>
          <StyledCoin symbol={farm.lpSymbols[1].symbol} size="40px" />
        </ImageBox>
      </Flex>

      <Flex flexDirection="column">
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>{lpLabel}</Text>

        <Flex alignItems="flex-end">
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
