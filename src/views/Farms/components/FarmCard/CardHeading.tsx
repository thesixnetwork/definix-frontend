import React, { useMemo } from 'react'
import styled from 'styled-components'
import useConverter from 'hooks/useConverter'
import { Flex, Box, Text, ColorStyles, Coin } from '@fingerlabs/definixswap-uikit-v2'
import ApyButton from './ApyButton'
import { FarmWithStakedValue } from './types'
import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'


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
  const isRow = useMemo(() => componentType === 'deposit' && (farm.bundleRewards || []).length > 0, [componentType, farm])

  const renderAPR = useMemo(() => (coin: string, apy: BigNumber) => {
    return <Flex alignItems="flex-end">
      <APRCoin symbol={coin} size="20px" />
      <Text textStyle="R_14M" color={ColorStyles.ORANGE}>
        APR
      </Text>
      <Text textStyle={isMediumSize ? 'R_20B' : 'R_18B'} color={ColorStyles.ORANGE} style={{ marginLeft: '4px', marginBottom: '-2px' }}>
        {convertToFarmAPRFormat(apy)}
      </Text>
      <Box style={{ marginLeft: '4px' }}>
        <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} apy={apy} coin={coin} />
      </Box>
    </Flex>
  }, [isMediumSize])

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

      <Flex flexDirection={isRow ? 'row' : 'column'} alignItems={isRow ? "center" : "flex-start"}>
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>{lpLabel}</Text>
        <Flex flexDirection="column" ml={isRow ? '50px' : ''} mt="3px">
          {(farm.bundleRewards || []).length > 0 && renderAPR(QuoteToken.FAVOR, farm.favorApy)}
          {renderAPR(QuoteToken.FINIX, farm.apy)}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(CardHeading)

const ImageBox = styled(Box)`
  &:first-child {
    z-index: 1;
  }
  &:last-child {
    margin-left: -10px;
  }
`

const StyledCoin = styled(Coin)`
  width: 40px;
  height: 40px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 36px;
    height: 36px;
  }
`

const APRCoin = styled(Coin)`
  margin-right: 3px;
`