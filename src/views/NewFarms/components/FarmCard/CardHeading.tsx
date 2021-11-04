import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Image, Skeleton, Text, ChevronRightIcon, Link } from 'uikit-dev'
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
  isHorizontal?: boolean
  inlineMultiplier?: boolean
}

const StyledFarmImages = styled.div`
  display: flex;
  align-items: center;

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

const CardHeading: React.FC<ExpandableSectionProps> = ({
  farm,
  lpLabel,
  removed,
  addLiquidityUrl,
  finixPrice,
  className = '',
  isHorizontal = false,
}) => {
  // We assume the token name is coin pair + lp e.g. FINIX-BNB LP, LINK-BNB LP,
  // NAR-FINIX LP. The images should be finix-bnb.svg, link-bnb.svg, nar-finix.svg
  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const firstCoin = farmImage.split('-')[0].toLocaleLowerCase()
  // const firstCoin = farm.tokenSymbol.toLocaleLowerCase()
  const secondCoin = farmImage.split('-')[1].toLocaleLowerCase()
  // const secondCoin = farm.quoteTokenSymbol.toLocaleLowerCase()
  const farmAPY = farm.apy && numeral(farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')
  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)

  const TranslateString = useI18n()

  const LinkView = ({ linkClassName = '' }) => (
    <Link
      external
      href={`${process.env.REACT_APP_KLAYTN_URL}/account/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
      bold={false}
      className={`flex-shrink ${linkClassName} ml-2`}
      color="textSubtle"
      fontSize="12px"
    >
      {TranslateString(356, 'KlaytnScope')}
      <ChevronRightIcon color="textSubtle" />
    </Link>
  )

  const imgSize = isHorizontal ? 48 : 56

  return (
    <Flex className={`pos-relative ${className}`} flexDirection="column" alignItems="center" justifyContent="center">
      <Flex className="w-100" justifyContent="space-evenly">
        <StyledFarmImages>
          <a
            href={
              firstCoin === 'klay'
                ? `${process.env.REACT_APP_KLAYTN_URL}`
                : `${process.env.REACT_APP_KLAYTN_URL}/account/${farm.firstToken[process.env.REACT_APP_CHAIN_ID]}`
            }
            target="_blank"
            rel="noreferrer"
          >
            <Image src={`/images/coins/${firstCoin}.png`} alt={farm.tokenSymbol} width={imgSize} height={imgSize} />
          </a>
          <a
            href={
              secondCoin === 'klay'
                ? `${process.env.REACT_APP_KLAYTN_URL}`
                : `${process.env.REACT_APP_KLAYTN_URL}/account/${farm.secondToken[process.env.REACT_APP_CHAIN_ID]}`
            }
            target="_blank"
            rel="noreferrer"
          >
            <Image src={`/images/coins/${secondCoin}.png`} alt={farm.tokenSymbol} width={imgSize} height={imgSize} />
          </a>
        </StyledFarmImages>
        <div>
          {!removed && (
            <div className="flex align-center justify-center mt-2">
              <Apr color="success" bold>
                {TranslateString(736, 'APR')}
                <div className="ml-1">{farm.apy ? `${farmAPY}%` : <Skeleton height={24} width={80} />}</div>
              </Apr>
              <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} finixPrice={finixPrice} apy={farm.apy} />
            </div>
          )}
          <Heading fontSize={isHorizontal ? '20px !important' : '24px !important'} fontWeight="500 !important">
            {lpLabel}
          </Heading>
        </div>
      </Flex>

      {/* <LinkView /> */}

      {/* <Flex justifyContent="center">
        {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
        <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
      </Flex> */}
    </Flex>
  )
}

export default CardHeading