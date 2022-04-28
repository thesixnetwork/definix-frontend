import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { QuoteToken } from 'config/constants/types'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import FarmContext from '../../FarmContext'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import CardHeading from './CardHeading'
import CardHeadingAccordion from './CardHeadingAccordion'
import DetailsSection from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import { FarmCardProps } from './types'

const CardStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
`

const VerticalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
`

const HorizontalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
`

const HorizontalMobileStyle = styled(CardStyle)`
  .accordion-content {
    &.hide {
      display: none;
    }

    &.show {
      display: block;
    }
  }
`

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  klaytn,
  removed,
  sixPrice,
  finixPrice,
  klayPrice,
  oethPrice,
  account,
  isHorizontal = false,
  inlineMultiplier = false,
}) => {
  const { onPresent } = useContext(FarmContext)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
      return klayPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
      return finixPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.oETH) {
      return oethPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.SIX) {
      return sixPrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [sixPrice, klayPrice, finixPrice, oethPrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('DEFINIX', '')
  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { pendingRewards, earnings, tokenBalance, stakedBalance } = useFarmUser(pid)

  const ratio = new BigNumber(stakedBalance).div(new BigNumber(farm.lpTotalSupply))
  const stakedTotalInQuoteToken = new BigNumber(farm.quoteTokenBlanceLP)
    .div(new BigNumber(10).pow(farm.quoteTokenDecimals))
    .times(ratio)
    .times(new BigNumber(2))
  const stakedBalanceValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return new BigNumber(0)
    }
    if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
      return klayPrice.times(stakedTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
      return finixPrice.times(stakedTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.oETH) {
      return oethPrice.times(stakedTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.SIX) {
      return sixPrice.times(stakedTotalInQuoteToken)
    }
    return stakedTotalInQuoteToken
  }, [
    sixPrice,
    klayPrice,
    finixPrice,
    oethPrice,
    farm.lpTotalInQuoteToken,
    farm.quoteTokenSymbol,
    stakedTotalInQuoteToken,
  ])

  const stakedBalanceValueFormated = stakedBalanceValue
    ? `$${Number(stakedBalanceValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const { bundleRewardLength, bundleRewards, quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const renderCardHeading = useCallback(
    (className?: string) => (
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
    ),
    [addLiquidityUrl, farm, finixPrice, isHorizontal, lpLabel, removed, inlineMultiplier],
  )

  const renderDepositModal = useCallback(() => {
    onPresent(
      <DepositModal
        max={tokenBalance}
        onConfirm={onStake}
        tokenName={lpLabel}
        addLiquidityUrl={addLiquidityUrl}
        renderCardHeading={renderCardHeading}
      />,
    )
  }, [addLiquidityUrl, lpLabel, onPresent, onStake, renderCardHeading, tokenBalance])

  const renderWithdrawModal = useCallback(() => {
    onPresent(
      <WithdrawModal
        max={stakedBalance}
        onConfirm={onUnstake}
        tokenName={lpLabel}
        renderCardHeading={renderCardHeading}
      />,
    )
  }, [lpLabel, onPresent, onUnstake, renderCardHeading, stakedBalance])

  const renderStakeAction = useCallback(
    (className?: string) => (
      <StakeAction
        farm={farm}
        klaytn={klaytn}
        account={account}
        className={className}
        onPresentDeposit={renderDepositModal}
        onPresentWithdraw={renderWithdrawModal}
      />
    ),
    [account, klaytn, farm, renderDepositModal, renderWithdrawModal],
  )

  const renderHarvestActionAirDrop = useCallback(
    (className?: string, isHor?: boolean) => (
      <HarvestActionAirDrop
        farm={farm}
        pendingRewards={pendingRewards}
        bundleRewardLength={bundleRewardLength}
        bundleRewards={bundleRewards}
        earnings={earnings}
        pid={pid}
        className={className}
        isHorizontal={isHor}
      />
    ),
    [earnings, pid, pendingRewards, bundleRewardLength, bundleRewards, farm],
  )

  const renderDetailsSection = useCallback(
    (className?: string, isHor?: boolean) => (
      <DetailsSection
        removed={removed}
        klaytnAddress={`${process.env.REACT_APP_KLAYTN_URL}/account/${
          farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]
        }`}
        totalValueFormated={totalValueFormated}
        stakedBalanceValueFormated={stakedBalanceValueFormated}
        lpLabel={lpLabel}
        addLiquidityUrl={addLiquidityUrl}
        isHorizontal={isHor}
        className={className}
      />
    ),
    [addLiquidityUrl, farm.lpAddresses, lpLabel, removed, totalValueFormated, stakedBalanceValueFormated],
  )

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  if (isHorizontal) {
    if (isMobile) {
      return (
        <HorizontalMobileStyle className="mb-3">
          <CardHeadingAccordion
            farm={farm}
            lpLabel={lpLabel}
            removed={removed}
            addLiquidityUrl={addLiquidityUrl}
            finixPrice={finixPrice}
            className=""
            isOpenAccordion={isOpenAccordion}
            setIsOpenAccordion={setIsOpenAccordion}
            inlineMultiplier={inlineMultiplier || false}
          />
          <div className={`accordion-content ${isOpenAccordion ? 'show' : 'hide'}`}>
            {renderStakeAction('pa-5')}
            {/* renderHarvestAction('pa-5') */}
            {renderHarvestActionAirDrop('pa-5 pt-0', false)}
            {renderDetailsSection('px-5 py-3', false)}
          </div>
        </HorizontalMobileStyle>
      )
    }

    return (
      <HorizontalStyle className="flex align-stretch px-5 py-6 mb-5">
        {renderCardHeading('col-3 pos-static')}

        <div className="col-4 bd-x flex flex-column justify-space-between px-5">
          {renderStakeAction('pb-4')}
          {renderDetailsSection('', true)}
        </div>

        {/* renderHarvestAction('col-5 pl-5 flex-grow') */}
        {renderHarvestActionAirDrop('col-5 pl-5 flex-grow', isHorizontal)}
      </HorizontalStyle>
    )
  }

  return (
    <VerticalStyle className="mb-7">
      <div className="flex flex-column flex-grow">
        {renderCardHeading('pt-7')}
        {renderStakeAction('pa-5')}
        {/* renderHarvestAction('pa-5') */}
        {renderHarvestActionAirDrop('pa-5 pt-0', isHorizontal)}
      </div>
      {renderDetailsSection('px-5 py-3', false)}
    </VerticalStyle>
  )
}

export default FarmCard
