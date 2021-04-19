import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { communityFarms } from 'config/constants'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import React, { useMemo, useState } from 'react'
import { Farm } from 'state/types'
import styled from 'styled-components'
import { Flex, Skeleton, Text } from 'uikit-dev'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { provider } from 'web3-core'
import miniLogo from '../../../../uikit-dev/images/finix-coin.png'
import colorStroke from '../../../../uikit-dev/images/Color-stroke.png'
import CardActionsContainer from './CardActionsContainer'
import CardHeading from './CardHeading'
import DetailsSection from './DetailsSection'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const MiniLogo = styled.img`
  width: 16px;
  height: auto;
  margin-right: 6px;
`

const ExpandableRainbow = styled.div`
  position: relative;
  padding-top: 4px;

  .color-stroke {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%);
    height: 4px;
    width: 100%;
  }
`

const FCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  text-align: center;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  bnbPrice?: BigNumber
  ethPrice?: BigNumber
  sixPrice?: BigNumber
  finixPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  removed,
  sixPrice,
  finixPrice,
  bnbPrice,
  ethPrice,
  ethereum,
  account,
}) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. FINIX-BNB LP, LINK-BNB LP,
  // NAR-FINIX LP. The images should be finix-bnb.svg, link-bnb.svg, nar-finix.svg
  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
      return finixPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.SIX) {
      return sixPrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [sixPrice, bnbPrice, finixPrice, ethPrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('DEFINIX', '')
  const earnLabel = farm.dual ? farm.dual.earnLabel : 'FINIX'
  const farmAPY = farm.apy && numeral(farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  return (
    <FCard>
      {/* {farm.tokenSymbol === 'FINIX' && <StyledCardAccent />} */}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={farm.multiplier}
        isCommunityFarm={isCommunityFarm}
        farmImage={farmImage}
        tokenSymbol={farm.tokenSymbol}
      />
      <div className="pa-5">
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center" className="mb-2">
            <Text>{TranslateString(736, 'APR')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {farm.apy ? (
                <>
                  {/* <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} finixPrice={finixPrice} apy={farm.apy} /> */}
                  {farmAPY}%
                </>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}
        <Flex justifyContent="space-between" className="mb-2">
          <Text>{TranslateString(318, 'Earn')}:</Text>
          <Flex alignItems="center">
            <MiniLogo src={miniLogo} alt="" />
            <Text bold>{earnLabel}</Text>
          </Flex>
        </Flex>
        <CardActionsContainer farm={farm} ethereum={ethereum} account={account} addLiquidityUrl={addLiquidityUrl} />
      </div>

      <ExpandableRainbow>
        <img src={colorStroke} alt="" className="color-stroke" />
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        <ExpandingWrapper expanded={showExpandableSection}>
          <DetailsSection
            removed={removed}
            bscScanAddress={`https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
            totalValueFormated={totalValueFormated}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
          />
        </ExpandingWrapper>
      </ExpandableRainbow>
    </FCard>
  )
}

export default FarmCard
