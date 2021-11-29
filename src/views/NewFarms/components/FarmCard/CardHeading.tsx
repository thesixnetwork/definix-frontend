import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import { getLpImageUrls } from 'utils/getTokenImage'
import useConverter from 'hooks/useConverter'
import { Flex, Box, Image, Text, ColorStyles } from 'definixswap-uikit'
import ApyButton from './ApyButton'
import { FarmWithStakedValue } from './types'
// import { communityFarms } from 'config/constants'

export interface ExpandableSectionProps {
  farm: FarmWithStakedValue
  lpLabel?: string
  multiplier?: string
  removed?: boolean
  addLiquidityUrl?: string
  size?: string
  // inlineMultiplier?: boolean
}

const CardHeading: React.FC<ExpandableSectionProps> = ({
  farm,
  lpLabel,
  removed,
  addLiquidityUrl,
  size = 'medium',
}) => {
  const { convertToFarmAPRFormat } = useConverter()
  // We assume the token name is coin pair + lp e.g. FINIX-BNB LP, LINK-BNB LP,
  // NAR-FINIX LP. The images should be finix-bnb.svg, link-bnb.svg, nar-finix.svg
  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  const isMediumSize = useMemo(() => size === 'medium', [size])
  const imageSize = useMemo(() => (isMediumSize ? 48 : 40), [isMediumSize])
  const [firstCoinImageUrl, secondCoinImageUrl] = getLpImageUrls(lpLabel)
  const displayApy = useMemo(() => {
    try {
      return `${convertToFarmAPRFormat(farm.apy)}%`
    } catch (error) {
      return '-'
    }
  }, [convertToFarmAPRFormat, farm.apy])

  return (
    <Flex position="relative">
      <Flex className="mr-s12" alignItems="center">
        <Box width={imageSize} style={{ zIndex: 1 }}>
          <Image src={firstCoinImageUrl} alt={farm.tokenSymbol} width={imageSize} height={imageSize} />
        </Box>
        <Box width={imageSize} style={{ marginLeft: '-10px' }}>
          <Image src={secondCoinImageUrl} alt={farm.tokenSymbol} width={imageSize} height={imageSize} />
        </Box>
      </Flex>

      <Flex flexDirection="column">
        <Text textStyle={isMediumSize ? 'R_20M' : 'R_18M'}>{lpLabel}</Text>

        {!removed && (
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
        )}
      </Flex>
    </Flex>

    // <Flex justifyContent="center">
    //   {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
    //   <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
    // </Flex>
  )
}

export default CardHeading
