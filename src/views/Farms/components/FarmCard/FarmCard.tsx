import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { QuoteToken } from 'config/constants/types'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import React, { useMemo } from 'react'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import { useModal } from 'uikit-dev'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
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
  const { earnings, tokenBalance, stakedBalance } = useFarmUser(pid)

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const renderCardHeading = (className?: string, inlineMultiplier?: boolean) => (
    <CardHeading
      farm={farm}
      lpLabel={lpLabel}
      removed={removed}
      addLiquidityUrl={addLiquidityUrl}
      finixPrice={finixPrice}
      isHorizontal={isHorizontal}
      className={className}
      inlineMultiplier={inlineMultiplier || false}
    />
  )

  const renderStakeAction = (className?: string) => (
    <StakeAction
      farm={farm}
      ethereum={ethereum}
      account={account}
      className={className}
      onPresentDeposit={onPresentDeposit}
      onPresentWithdraw={onPresentWithdraw}
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

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={lpLabel}
      addLiquidityUrl={addLiquidityUrl}
      renderCardHeading={renderCardHeading}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={lpLabel}
      renderCardHeading={renderCardHeading}
    />,
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
      {renderCardHeading('pt-7')}
      {renderStakeAction('pa-5')}
      {renderHarvestAction('pa-5')}
      {renderDetailsSection('px-5 py-3')}
    </VerticalStyle>
  )
}

export default FarmCard
