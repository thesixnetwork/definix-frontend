import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { QuoteToken } from 'config/constants/types'
import React, { useMemo } from 'react'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import CardHeading from './CardHeading'
import DetailsSection from './DetailsSection'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'
import { FarmCardProps } from './types'

const VerticalStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  display: flex;
  position: relative;
  align-self: baseline;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
`

const HorizontalStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  display: flex;
  position: relative;
`

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  removed,
  sixPrice,
  finixPrice,
  bnbPrice,
  ethPrice,
  ethereum,
  account,
  isHorizontal = false,
}) => {
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
  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { earnings } = useFarmUser(pid)

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const renderCardHeading = (className?: string) => (
    <CardHeading
      farm={farm}
      lpLabel={lpLabel}
      multiplier={farm.multiplier}
      tokenSymbol={farm.tokenSymbol}
      removed={removed}
      addLiquidityUrl={addLiquidityUrl}
      finixPrice={finixPrice}
      isHorizontal={isHorizontal}
      className={className}
    />
  )

  const renderStakeAction = (className?: string) => (
    <StakeAction
      farm={farm}
      ethereum={ethereum}
      account={account}
      addLiquidityUrl={addLiquidityUrl}
      className={className}
    />
  )

  const renderHarvestAction = (className?: string) => (
    <HarvestAction earnings={earnings} pid={pid} className={className} />
  )

  const renderDetailsSection = (className?: string) => (
    <DetailsSection
      removed={removed}
      bscScanAddress={`https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
      totalValueFormated={totalValueFormated}
      lpLabel={lpLabel}
      addLiquidityUrl={addLiquidityUrl}
      isHorizontal={isHorizontal}
      className={className}
    />
  )

  if (isHorizontal) {
    return (
      <HorizontalStyle className="flex align-stretch pa-5 mb-4">
        {renderCardHeading('col-3 pos-static')}

        <div className="col-5 bd-x flex flex-column justify-space-between px-5">
          {renderStakeAction('pb-5')}
          {renderDetailsSection()}
        </div>

        {renderHarvestAction('col-4 pl-5 flex-grow')}
      </HorizontalStyle>
    )
  }

  return (
    <VerticalStyle className="mb-7">
      {renderCardHeading('pt-6')}
      {renderStakeAction('pa-5')}
      {renderHarvestAction('pa-5')}
      {renderDetailsSection('px-5 py-3')}
    </VerticalStyle>
  )
}

export default FarmCard
