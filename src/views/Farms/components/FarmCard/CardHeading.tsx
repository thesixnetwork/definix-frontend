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
  const isRow = useMemo(
    () => componentType === 'deposit' && (farm.bundleRewards || []).length > 0,
    [componentType, farm],
  )

  const renderAPR = useMemo(
    () => (coin: string, apy: BigNumber) => {
      return (
        <Flex alignItems="flex-end">
          <APRCoin symbol={coin} size="20px" />
          <Text textStyle="R_14M" color={ColorStyles.ORANGE}>
            APR
          </Text>
          <Text
            textStyle={isMediumSize ? 'R_20B' : 'R_18B'}
            color={ColorStyles.ORANGE}
            style={{ marginLeft: '4px', marginBottom: '-2px' }}
          >
            {['0', 'Infinity'].includes(apy.toString()) ? '0' : coin === 'Favor' ? 0 : convertToFarmAPRFormat(apy)}%
          </Text>
          <Box style={{ marginLeft: '4px' }}>
            <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} apy={apy} coin={coin} />
          </Box>
        </Flex>
      )
    },
    [isMediumSize],
  )

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

      <Header isRow={isRow}>
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>{lpLabel}</Text>
        <APRCoins isRow={isRow}>
          {(farm.bundleRewards || []).length > 0 && renderAPR(QuoteToken.FAVOR, farm.favorApy)}
          {renderAPR(QuoteToken.FINIX, farm.apy)}
        </APRCoins>
      </Header>
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

const APRCoins = styled(Flex)<{ isRow: boolean }>`
  flex-direction: column;
  margin-left: ${({ isRow }) => (isRow ? '50px' : '')};
  margin-top: 3px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-left: 0;
  }
`

const APRCoin = styled(Coin)`
  margin-right: 3px;
`

const Header = styled(Flex)<{ isRow: boolean }>`
  flex-direction: ${({ isRow }) => (isRow ? 'row' : 'column')};
  align-items: ${({ isRow }) => (isRow ? 'center' : 'flex-start')};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
  }
`
