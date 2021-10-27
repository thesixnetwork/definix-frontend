import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { convertToUsd } from 'utils/formatPrice'
import { QuoteToken } from 'config/constants/types'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
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
  kethPrice,
  account,
  isHorizontal = false,
}) => {
  const { onPresent } = useContext(FarmContext)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const getTokenValue = useCallback(
    (token) => {
      if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
        return klayPrice.times(token)
      }
      if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
        return finixPrice.times(token)
      }
      if (farm.quoteTokenSymbol === QuoteToken.KETH) {
        return kethPrice.times(token)
      }
      if (farm.quoteTokenSymbol === QuoteToken.SIX) {
        return sixPrice.times(token)
      }
      return token
    },
    [farm.quoteTokenSymbol, klayPrice, finixPrice, kethPrice, sixPrice],
  )

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('DEFINIX', '')
  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { earnings, tokenBalance, stakedBalance, allowance } = useFarmUser(pid)

  const ratio = new BigNumber(stakedBalance).div(new BigNumber(farm.lpTotalSupply))
  const stakedTotalInQuoteToken = new BigNumber(farm.quoteTokenBlanceLP)
    .div(new BigNumber(10).pow(farm.quoteTokenDecimals))
    .times(ratio)
    .times(new BigNumber(2))
  const stakedBalanceValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return new BigNumber(0)
    }
    return getTokenValue(stakedTotalInQuoteToken)
  }, [farm.lpTotalInQuoteToken, stakedTotalInQuoteToken, getTokenValue])

  const { bundleRewardLength, quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  /**
   * totalValue in
   */
  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) return null
    return getTokenValue(farm.lpTotalInQuoteToken)
  }, [farm.lpTotalInQuoteToken, getTokenValue])
  const totalValueFormated = useMemo(() => convertToUsd(totalValue), [totalValue])
  /**
   * my liquidity
   */
  const myLiquidityUSDPrice = useMemo(() => {
    return convertToUsd(stakedBalanceValue)
  }, [stakedBalanceValue])

  const renderCardHeading = useCallback(
    (className?: string, inlineMultiplier?: boolean) => (
      <CardHeading
        isHorizontal={isHorizontal}
        className={className}
        farm={farm}
        lpLabel={lpLabel}
        removed={removed}
        addLiquidityUrl={addLiquidityUrl}
        finixPrice={finixPrice}
        inlineMultiplier={inlineMultiplier || false}
      />
    ),
    [addLiquidityUrl, farm, finixPrice, isHorizontal, lpLabel, removed],
  )

  const renderDepositModal = useCallback(() => {
    onPresent(
      <DepositModal
        tokenName={lpLabel}
        max={tokenBalance}
        onConfirm={onStake}
        addLiquidityUrl={addLiquidityUrl}
        renderCardHeading={renderCardHeading}
        totalLiquidity={totalValueFormated}
        myLiquidity={stakedBalance}
        myLiquidityUSDPrice={myLiquidityUSDPrice}
      />,
      {
        title: 'Deposit LP',
        description: 'Farm에 LP를 예치하세요'
      }
    )
  }, [
    addLiquidityUrl,
    lpLabel,
    onPresent,
    onStake,
    renderCardHeading,
    tokenBalance,
    totalValueFormated,
    stakedBalance,
    myLiquidityUSDPrice,
  ])

  const renderWithdrawModal = useCallback(() => {
    onPresent(
      <WithdrawModal
        onConfirm={onUnstake}
        tokenName={lpLabel}
        renderCardHeading={renderCardHeading}
        totalLiquidity={totalValueFormated}
        myLiquidity={stakedBalance}
        myLiquidityUSDPrice={myLiquidityUSDPrice}
      />,
      {
        title: 'Remove LP',
        description: 'Farm 예치한 LP를 제거하세요'
      }
    )
  }, [
    lpLabel,
    onPresent,
    onUnstake,
    renderCardHeading,
    totalValueFormated,
    stakedBalance,
    myLiquidityUSDPrice
  ])

  /**
   * detail section
   */
  const renderDetailsSection = useCallback(
    (className?: string, isHor?: boolean) => (
      <DetailsSection
        removed={removed}
        totalValueFormated={totalValueFormated}
        isHorizontal={isHor}
        className={className}
      />
    ),
    [removed, totalValueFormated],
  )

  /**
   * stake action
   */
  const isApproved = useMemo(() => {
    return account && allowance && allowance.isGreaterThan(0)
  }, [account, allowance])
  const renderStakeAction = useCallback(
    (className?: string) => (
      <StakeAction
        isApproved={isApproved}
        myLiquidity={stakedBalance}
        myLiquidityUSDPrice={myLiquidityUSDPrice}
        farm={farm}
        klaytn={klaytn}
        account={account}
        className={className}
        onPresentDeposit={renderDepositModal}
        onPresentWithdraw={renderWithdrawModal}
      />
    ),
    [account, klaytn, farm, renderDepositModal, renderWithdrawModal, isApproved, stakedBalance, myLiquidityUSDPrice],
  )

  /**
   * harvest action
   */
  const renderHarvestActionAirDrop = useCallback(
    (className?: string, isHor?: boolean) => (
      <HarvestActionAirDrop
        isHorizontal={isHor}
        className={className}
        pid={pid}
        bundleRewardLength={bundleRewardLength}
        earnings={earnings}
      />
    ),
    [earnings, pid, bundleRewardLength],
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
        {renderCardHeading('col-4 pos-static')}

        {renderDetailsSection('col-4 bd-x pa-3', true)}

        <div className="flex col-4">
          {renderStakeAction(`pa-3 ${isApproved || 'col-12'}`)}
          {isApproved && renderHarvestActionAirDrop('col-6 pa-3')}
        </div>

        {/*  */}
        {/* {renderHarvestActionAirDrop('col-5 pl-5 flex-grow', isHorizontal)} */}
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
