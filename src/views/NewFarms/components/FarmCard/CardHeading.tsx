import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
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
  // inlineMultiplier?: boolean
}

const CardHeading: React.FC<ExpandableSectionProps> = ({ farm, lpLabel, removed, addLiquidityUrl }) => {
  // We assume the token name is coin pair + lp e.g. FINIX-BNB LP, LINK-BNB LP,
  // NAR-FINIX LP. The images should be finix-bnb.svg, link-bnb.svg, nar-finix.svg
  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  
  const farmImage = useMemo(() => farm.lpSymbol.split(' ')[0].toLocaleLowerCase(), [farm.lpSymbol])
  const firstCoin = useMemo(() => farmImage.split('-')[0].toLocaleLowerCase(), [farmImage])
  const secondCoin = useMemo(() => farmImage.split('-')[1].toLocaleLowerCase(), [farmImage])

  const displayApy = useMemo(() => {
    try {
      return farm.apy && `${farm.apy.times(new BigNumber(100)).toNumber().toFixed(2)}%`
    } catch (error) {
      return '-'
    }
  }, [farm.apy])

  return (
    <Flex position="relative">
      <Flex className="mr-s12">
        <Box width={40} style={{ zIndex: 1 }}>
          <Image src={`/images/coins/${firstCoin}.png`} alt={farm.tokenSymbol} width={40} height={40} />
        </Box>
        <Box width={40} style={{ marginLeft: '-10px' }}>
          <Image src={`/images/coins/${secondCoin}.png`} alt={farm.tokenSymbol} width={40} height={40} />
        </Box>
      </Flex>

      <Flex flexDirection="column">
        <Text textStyle="R_20M">{lpLabel}</Text>

        {!removed && (
          <Flex alignItems="end">
            <Text textStyle="R_14M" color={ColorStyles.RED} style={{ paddingBottom: '2px' }}>
              APR
            </Text>
            <Text textStyle="R_20B" color={ColorStyles.RED} style={{ marginLeft: '4px' }}>
              {displayApy}
            </Text>
            <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} apy={farm.apy} />
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
