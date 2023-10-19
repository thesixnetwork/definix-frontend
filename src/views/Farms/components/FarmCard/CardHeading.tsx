import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import Flex from 'uikitV2/components/Box/Flex'
import Box from 'uikitV2/components/Box/Box'
import Text from 'uikitV2/components/Text/Text'
import { ColorStyles } from 'uikitV2/colors'
import Link from 'uikitV2/components/Link/Link'
import Coin from 'uikitV2/components/Coin/Coin'
import { ChevronRightIcon } from 'uikit-dev'
import ribbin from 'uikit-dev/images/for-ui-v2/ribbin.png'
import ApyButton from './ApyButton'
import { FarmWithStakedValue } from './types'
import { QuoteToken } from 'config/constants/types'
// import { communityFarms } from 'config/constants'

const convertToFarmAPRFormat = (apy) => {
  return numeral(apy.times(100).toFixed(2)).format('0,0.[00]')
}

export interface ExpandableSectionProps {
  farm: FarmWithStakedValue
  componentType?: string
  lpLabel?: string
  multiplier?: string
  tokenSymbol?: string
  removed?: boolean
  addLiquidityUrl?: string
  finixPrice?: BigNumber
  className?: string
  isHorizontal?: boolean
  inlineMultiplier?: boolean
  size?: string
}

const MultiplierTag = styled.div`
  position: absolute;
  top: -1px;
  left: 16px;
  width: 52px;
  height: 36px;
  background: url(${ribbin});
  background-size: contain;
  background-repeat: no-repeat;

  p {
    color: ${({ theme }) => theme.colors.white};
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
`

const InlineMultiplierTag = styled.div`
  background: linear-gradient(#f3d36c, #e27d3a);

  border-radius: ${({ theme }) => theme.radii.small};
  margin-left: 4px;

  p {
    padding: 0 8px;
    line-height: 26px;
    color: ${({ theme }) => theme.colors.white};
    font-weight: bold;
    font-size: 12px;
    text-align: center;
  }
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

const ImageBox = styled(Box)`
  &:first-child {
    z-index: 1;
  }
  &:last-child {
    margin-left: -10px;
  }
`

const StyledCoin = styled(Coin)`
  width: 44px;
  height: 40px;
  @media screen and (max-width: 1280px) {
    width: 36px;
    height: 36px;
  }
`

const APRCoins = styled(Flex)<{ isRow: boolean }>`
  flex-direction: column;
  margin-left: ${({ isRow }) => (isRow ? '50px' : '')};
  margin-top: 3px;
  @media screen and (max-width: 1280px) {
    margin-left: 0;
  }
`

const APRCoin = styled(Coin)`
  margin-right: 3px;
`

const Header = styled(Flex)<{ isRow: boolean }>`
  flex-direction: ${({ isRow }) => (isRow ? 'row' : 'column')};
  align-items: ${({ isRow }) => (isRow ? 'center' : 'flex-start')};

  @media screen and (max-width: 1280px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  size = 'medium',
  farm,
  lpLabel,
  componentType,
  removed,
  addLiquidityUrl,
  finixPrice,
  className = '',
  isHorizontal = false,
  inlineMultiplier = false,
}) => {
  // We assume the token name is coin pair + lp e.g. FINIX-BNB LP, LINK-BNB LP,
  // NAR-FINIX LP. The images should be finix-bnb.svg, link-bnb.svg, nar-finix.svg
  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const firstCoin = farmImage.split('-')[0].toLocaleLowerCase()
  const secondCoin = farmImage.split('-')[1].toLocaleLowerCase()
  const farmAPY = farm.apy && numeral(farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')
  const isRow = useMemo(() => componentType === 'deposit', [componentType, farm])
  const isMediumSize = useMemo(() => size === 'medium', [size])
  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)

  const TranslateString = useI18n()

  const LinkView = ({ linkClassName = '' }) => (
    <Link
      external
      href={`https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
      bold={false}
      className={`flex-shrink ${linkClassName} ml-2`}
      color="textSubtle"
      fontSize="12px"
    >
      {TranslateString(356, 'Bscscan')}
      <ChevronRightIcon color="textSubtle" />
    </Link>
  )

  const imgSize = isHorizontal ? 48 : 56

  const renderAPR = useMemo(
    () => (coin: string, apy: BigNumber) => {
      return (
        <Flex alignItems="flex-end">
          <APRCoin symbol={coin} size="20px" />
          <Text textStyle="R_14M" color={'#ff6828'}>
            APR
          </Text>
          <Text
            textStyle={isMediumSize ? 'R_20B' : 'R_18B'}
            color={'#ff6828'}
            style={{ marginLeft: '4px', marginBottom: '-2px' }}
          >
            {['0', 'Infinity'].includes((apy || 0).toString()) ? '0' : convertToFarmAPRFormat(apy)}%
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
      <Flex mr={12} alignItems="center" width={'auto'}>
        <ImageBox>
          <StyledCoin symbol={firstCoin} size="40px" />
        </ImageBox>
        <ImageBox>
          <StyledCoin symbol={secondCoin} size="40px" />
        </ImageBox>
      </Flex>

      <Header isRow={isRow}>
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>{lpLabel}</Text>
        <APRCoins isRow={isRow}>{renderAPR(QuoteToken.FINIX, farm.apy)}</APRCoins>
      </Header>
    </Flex>
  )
}

export default CardHeading
