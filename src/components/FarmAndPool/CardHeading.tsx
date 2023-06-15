import React, { useMemo } from 'react'
import styled from 'styled-components'
import useConverter from 'hooks/useConverter'
import { Flex, Box, Text, ColorStyles, Coin } from '@fingerlabs/definixswap-uikit-v2'
import ApyButton from './ApyButton'
import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'

export interface ExpandableSectionProps {
  size?: string
  componentType?: string
  tokenNames: string
  tokenApyList: {
    symbol: QuoteToken | string
    apy: BigNumber
  }[]
  addLiquidityUrl?: string
  isFarm: boolean
}

const CardHeading: React.FC<ExpandableSectionProps> = ({
  size = 'medium',
  tokenNames,
  componentType,
  tokenApyList,
  addLiquidityUrl,
  isFarm,
}) => {
  const { convertToFarmAPRFormat, convertToPoolAPRFormat } = useConverter()
  const isMediumSize = useMemo(() => size === 'medium', [size])
  const isRow = useMemo(() => componentType === 'deposit' && tokenApyList.length > 1, [componentType, tokenApyList])

  const renderAPR = useMemo(
    () => (coin: string, apy: BigNumber, index: number) => {
      return (
        <Flex alignItems="flex-end" key={index}>
          <APRCoin symbol={coin} size="20px" />
          <Text textStyle="R_14M" color={ColorStyles.ORANGE}>
            APR
          </Text>
          <Text
            textStyle={isMediumSize ? 'R_20B' : 'R_18B'}
            color={ColorStyles.ORANGE}
            style={{ marginLeft: '4px', marginBottom: '-2px' }}
          >
            {apy && (isFarm ? convertToFarmAPRFormat(apy) : convertToPoolAPRFormat(apy))}%
          </Text>
          <Box style={{ marginLeft: '4px' }}>
            <ApyButton
              lpLabel={tokenApyList.map(({ symbol }) => symbol).join('-')}
              addLiquidityUrl={addLiquidityUrl}
              apy={apy}
              coin={coin}
            />
          </Box>
        </Flex>
      )
    },
    [isMediumSize, isFarm],
  )

  return (
    <Flex position="relative">
      <Flex
        mr={componentType === 'myInvestment' ? 'S_16' : 'S_12'}
        alignItems="center"
        width={componentType === 'myInvestment' ? '70px' : 'auto'}
      >
        {tokenNames.split('-').map((token, index) => (
          <ImageBox key={index}>
            <StyledCoin symbol={token} size="40px" />
          </ImageBox>
        ))}
      </Flex>

      <Flex flexDirection={isRow ? 'row' : 'column'} alignItems={isRow ? 'center' : 'flex-start'}>
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>{tokenNames}</Text>
        <Flex flexDirection="column" ml={isRow ? '50px' : ''} mt="3px">
          {tokenApyList.map(({ symbol, apy }, index) => renderAPR(symbol, apy, index))}
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
