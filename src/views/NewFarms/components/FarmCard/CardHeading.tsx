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
  finixPrice?: BigNumber
  // inlineMultiplier?: boolean
}

const CardHeading: React.FC<ExpandableSectionProps> = ({
  farm,
  lpLabel,
  removed,
  addLiquidityUrl,
  finixPrice,
}) => {
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

  // const LinkView = ({ linkClassName = '' }) => (
  //   <Link
  //     external
  //     href={`${process.env.REACT_APP_KLAYTN_URL}/account/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
  //     bold={false}
  //     className={`flex-shrink ${linkClassName} ml-2`}
  //     color="textSubtle"
  //     fontSize="12px"
  //   >
  //     {TranslateString(356, 'KlaytnScope')}
  //     <ChevronRightIcon color="textSubtle" />
  //   </Link>
  // )

  return (
    // <Flex className={`pos-relative ${className}`} flexDirection="column" alignItems="center" justifyContent="center">
    //   <Flex className="w-100" justifyContent="space-evenly">
    //     <StyledFarmImages>
    //       <a
    //         href={
    //           firstCoin === 'klay'
    //             ? `${process.env.REACT_APP_KLAYTN_URL}`
    //             : `${process.env.REACT_APP_KLAYTN_URL}/account/${farm.firstToken[process.env.REACT_APP_CHAIN_ID]}`
    //         }
    //         target="_blank"
    //         rel="noreferrer"
    //       >
    //         <Image src={`/images/coins/${firstCoin}.png`} alt={farm.tokenSymbol} width={imgSize} height={imgSize} />
    //       </a>
    //       <a
    //         href={
    //           secondCoin === 'klay'
    //             ? `${process.env.REACT_APP_KLAYTN_URL}`
    //             : `${process.env.REACT_APP_KLAYTN_URL}/account/${farm.secondToken[process.env.REACT_APP_CHAIN_ID]}`
    //         }
    //         target="_blank"
    //         rel="noreferrer"
    //       >
    //         <Image src={`/images/coins/${secondCoin}.png`} alt={farm.tokenSymbol} width={imgSize} height={imgSize} />
    //       </a>
    //     </StyledFarmImages>
    //     <div>
    //       {!removed && (
    //         <div className="flex align-center justify-center mt-2">
    //           <Apr color="success" bold>
    //             {TranslateString(736, 'APR')}
    //             <div className="ml-1">{farm.apy ? `${farmAPY}%` : <Skeleton height={24} width={80} />}</div>
    //           </Apr>
    //           <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} finixPrice={finixPrice} apy={farm.apy} />
    //         </div>
    //       )}
    //       <Heading fontSize={isHorizontal ? '20px !important' : '24px !important'} fontWeight="500 !important">
    //         {lpLabel}
    //       </Heading>
    //     </div>
    //   </Flex>

    //   {/* <LinkView /> */}

    // </Flex>

    
    <Flex position="relative">
      <Flex className="mr-s12">
        <Box width={48} style={{ zIndex: 1 }}>
          <Image src={`/images/coins/${firstCoin}.png`} alt={farm.tokenSymbol} width={48} height={48} />
        </Box>
        <Box width={48} style={{ marginLeft: '-10px' }}>
          <Image src={`/images/coins/${secondCoin}.png`} alt={farm.tokenSymbol} width={48} height={48} />
        </Box>
      </Flex>

      <Flex flexDirection="column">
        <Text textStyle="R_20M">{lpLabel}</Text>

        {
          !removed && (
            <Flex alignItems="end">
              <Text textStyle="R_14M" color={ColorStyles.RED} style={{ paddingBottom: '2px' }}>
                APR
              </Text>
              <Text textStyle="R_20B" color={ColorStyles.RED} style={{ marginLeft: '4px' }}>
                {displayApy}
              </Text>
              <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} finixPrice={finixPrice} apy={farm.apy} />
            </Flex>
          )
        }
      </Flex>
    </Flex>

    // <Flex justifyContent="center">
    //   {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
    //   <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
    // </Flex>
  )
}

export default CardHeading
