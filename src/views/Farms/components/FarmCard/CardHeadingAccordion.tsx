import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Flex, Heading, Image, Skeleton, Text } from 'uikit-dev'
import ApyButton from './ApyButton'
import { FarmWithStakedValue } from './types'
// import { communityFarms } from 'config/constants'

export interface ExpandableSectionProps {
  farm: FarmWithStakedValue
  lpLabel?: string
  multiplier?: string
  tokenSymbol?: string
  removed?: boolean
  addLiquidityUrl?: string
  finixPrice?: BigNumber
  className?: string
  isOpenAccordion: boolean
  setIsOpenAccordion: (isOpen: boolean) => void
}

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

const CardHeadingStyle = styled(Flex)`
  padding: 16px;

  .currency {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 0;

    .imgs {
      width: auto;
      margin-right: 8px;

      > div {
        width: 24px;
        height: 24px;
        min-width: initial;
      }
    }
  }
`

const CardHeadingAccordion: React.FC<ExpandableSectionProps> = ({
  farm,
  lpLabel,
  removed,
  addLiquidityUrl,
  finixPrice,
  className = '',
  isOpenAccordion = false,
  setIsOpenAccordion,
}) => {
  // We assume the token name is coin pair + lp e.g. FINIX-BNB LP, LINK-BNB LP,
  // NAR-FINIX LP. The images should be finix-bnb.svg, link-bnb.svg, nar-finix.svg

  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const firstCoin = farmImage.split('-')[0].toLocaleLowerCase()
  const secondCoin = farmImage.split('-')[1].toLocaleLowerCase()
  const farmAPY = farm.apy && numeral(farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')
  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)

  const TranslateString = useI18n()

  const imgSize = 24

  console.log('first', firstCoin)

  return (
    <CardHeadingStyle
      className={`${className} ${isOpenAccordion ? 'bd-b' : ''}`}
      flexDirection="column"
      justifyContent="center"
      onClick={() => {
        setIsOpenAccordion(!isOpenAccordion)
      }}
    >
      <div className="flex justify-space-between">
        <div className="currency">
          <StyledFarmImages className="imgs">
            <Image src={`/images/coins/${firstCoin}.png`} alt={farm.tokenSymbol} width={imgSize} height={imgSize} />
            <Image src={`/images/coins/${secondCoin}.png`} alt={farm.tokenSymbol} width={imgSize} height={imgSize} />
          </StyledFarmImages>

          <Heading fontSize="16px" fontWeight="500 !important">
            {lpLabel}
          </Heading>
        </div>
        {isOpenAccordion ? <ChevronUpIcon color="textSubtle" /> : <ChevronDownIcon color="textSubtle" />}
      </div>

      {!removed && (
        <div className="flex align-center mt-2">
          <Apr color="success" bold>
            {TranslateString(736, 'APR')}
            <div className="ml-1">{farm.apy ? `${farmAPY}%` : <Skeleton height={24} width={80} />}</div>
          </Apr>
          <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} finixPrice={finixPrice} apy={farm.apy} />

          <InlineMultiplierTag>
            <p>{farm.multiplier}</p>
          </InlineMultiplierTag>
        </div>
      )}

      {/* <Flex justifyContent="center">
        {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
        <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
      </Flex> */}
    </CardHeadingStyle>
  )
}

export default CardHeadingAccordion
