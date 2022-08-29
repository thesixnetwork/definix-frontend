import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useMemo } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { QuoteToken } from 'config/constants/types'
import { Flex, Box, Text, ColorStyles, Coin } from '@fingerlabs/definixswap-uikit-v2'
import { Heading, Image, Skeleton } from 'uikit-dev'
import BigNumber from 'bignumber.js'
import ApyButton from './ApyButton'
// import { CardHeadingProps } from './types'

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
  const isMediumSize = useMemo(() => size === 'medium', [size])
  const isRow = useMemo(() => componentType === 'deposit' && tokenApyList.length > 1, [componentType, tokenApyList])
  const TranslateString = useI18n()

  const finixPrice = usePriceFinixUsd()

  const imgSize = 40

  const renderAPR = (coin: string, apy: BigNumber, index: number) => {
    return (
      <Flex alignItems="flex-end" key={index}>
        <APRCoin symbol={coin} size="20px" />
        <Text textStyle="R_14M" color="rgb(255, 104, 40)">
          APR
        </Text>
        <Text
          textStyle={isMediumSize ? 'R_20B' : 'R_18B'}
          color="rgb(255, 104, 40)"
          style={{ marginLeft: '4px', marginBottom: '-2px' }}
        >
          {apy ? `${numeral(apy?.toNumber()).format('0,0.00')}%` : <Skeleton height={24} width={80} />}
        </Text>
        <ApyButton lpLabel={tokenNames} finixPrice={finixPrice} apy={apy} />
      </Flex>
    )
  }

  // return (
  //   <Flex className={`pos-relative ${className}`} flexDirection="column" alignItems="center" justifyContent="center">
  //     <StyledFarmImages>
  //       <Image src={`/images/coins/${tokenName.toLowerCase()}.png`} width={imgSize} height={imgSize} />
  //     </StyledFarmImages>

  //     <Heading fontSize={isHorizontal ? '20px !important' : '24px !important'} fontWeight="500 !important">
  //       {isOldSyrup && '[OLD]'} {tokenName} {TranslateString(348, 'Pool')}
  //     </Heading>

  //     <div className="flex align-center justify-center mt-2">
  //       <Apr color="success" bold>
  //         {TranslateString(736, 'APR')}
  //         <div className="ml-1">
  //           {apy ? `${numeral(apy?.toNumber()).format('0,0.00')}%` : <Skeleton height={24} width={80} />}
  //         </div>
  //       </Apr>
  //       <ApyButton lpLabel={tokenName} finixPrice={finixPrice} apy={apy} />
  //     </div>
  //   </Flex>
  // )

  return (
    <Flex position="relative">
      <Flex marginRight="16px" alignItems="center" width="auto">
        <ImageBox>
          <Image src={`/images/coins/${tokenNames.toLowerCase()}.png`} width={imgSize} height={imgSize} />
        </ImageBox>
      </Flex>

      <Flex flexDirection={isRow ? 'row' : 'column'} alignItems={isRow ? 'center' : 'flex-start'}>
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>{tokenNames}</Text>
        <Flex flexDirection="column" ml={isRow ? '50px' : ''}>
          {tokenApyList.map(({ symbol, apy }, index) => renderAPR(symbol, apy, index))}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CardHeading

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
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 36px;
    height: 36px;
  }
`

const APRCoin = styled(Coin)`
  margin-right: 3px;
`

const StyledFarmImages = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;

  > * {
    flex-shrink: 0;

    &:nth-child(01) {
      position: relative;
      z-index: 1;
    }
    &:nth-child(02) {
      margin-left: -8px;
    }
  }
`

const Apr = styled(Text)`
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.successAlpha};
  font-size: 12px;
  border-radius: ${({ theme }) => theme.radii.small};
  display: flex;
  align-items: center;
`
