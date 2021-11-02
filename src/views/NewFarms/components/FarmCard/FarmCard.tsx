import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { QuoteToken } from 'config/constants/types'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useConverter from 'hooks/useConverter'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
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

// const VerticalStyle = styled(CardStyle)`
//   display: flex;
//   position: relative;
//   flex-direction: column;
//   justify-content: space-between;
//   text-align: center;
// `

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
  onSelectAddLP,
  onSelectRemoveLP,
}) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const lpTokenName = useMemo(() => {
    return farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('DEFINIX', '')
  }, [farm.lpSymbol])

  const { convertToPriceFromToken, convertToUSD } = useConverter()
  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { earnings, tokenBalance, stakedBalance, allowance } = useFarmUser(pid)
  const getTokenPrice = useCallback(
    (token) => {
      return convertToPriceFromToken(token, farm.quoteTokenSymbol)
    },
    [farm.quoteTokenSymbol, convertToPriceFromToken],
  )
  const stakedBalanceValue: BigNumber = useMemo(() => {
    const { lpTotalInQuoteToken, lpTotalSupply, quoteTokenBlanceLP, quoteTokenDecimals } = farm
    if (!lpTotalInQuoteToken) {
      return new BigNumber(0)
    }
    const ratio = new BigNumber(stakedBalance).div(new BigNumber(lpTotalSupply))
    const stakedTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(ratio)
      .times(new BigNumber(2))
    return getTokenPrice(stakedTotalInQuoteToken)
  }, [farm, stakedBalance, getTokenPrice])
  const addLiquidityUrl = useMemo(() => {
    const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
    const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
    return `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  }, [farm])

  /**
   * total liquidity
   */
  const totalLiquidity: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) return null
    return getTokenPrice(farm.lpTotalInQuoteToken)
  }, [farm.lpTotalInQuoteToken, getTokenPrice])
  const totalLiquidityUSD = useMemo(() => convertToUSD(totalLiquidity), [totalLiquidity, convertToUSD])
  /**
   * my liquidity
   */
  const myLiquidityUSD = useMemo(() => {
    return convertToUSD(stakedBalanceValue)
  }, [convertToUSD, stakedBalanceValue])

  const renderCardHeading = useCallback(
    (className?: string, inlineMultiplier?: boolean) => (
      <CardHeading
        isHorizontal={isHorizontal}
        className={className}
        farm={farm}
        lpLabel={lpTokenName}
        removed={removed}
        addLiquidityUrl={addLiquidityUrl}
        finixPrice={finixPrice}
        inlineMultiplier={inlineMultiplier || false}
      />
    ),
    [addLiquidityUrl, farm, finixPrice, isHorizontal, lpTokenName, removed],
  )

  /**
   * detail section
   */
  const renderDetailsSection = useCallback(
    (className?: string, isHor?: boolean) => (
      <DetailsSection
        isHorizontal={isHor}
        className={className}
        removed={removed}
        totalLiquidityUSD={totalLiquidityUSD}
      />
    ),
    [removed, totalLiquidityUSD],
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
        myLiquidityUSD={myLiquidityUSD}
        farm={farm}
        klaytn={klaytn}
        account={account}
        className={className}
        onPresentDeposit={() => {
          onSelectAddLP({
            pid,
            tokenName: lpTokenName,
            tokenBalance,
            addLiquidityUrl,
            totalLiquidity: totalLiquidityUSD,
            myLiquidity: stakedBalance,
            myLiquidityUSD,
          })
        }}
        onPresentWithdraw={() => {
          onSelectRemoveLP({
            pid,
            tokenName: lpTokenName,
            tokenBalance,
            addLiquidityUrl,
            totalLiquidity: totalLiquidityUSD,
            myLiquidity: stakedBalance,
            myLiquidityUSD,
          })
        }}
      />
    ),
    [
      account,
      klaytn,
      farm,
      isApproved,
      stakedBalance,
      lpTokenName,
      pid,
      tokenBalance,
      addLiquidityUrl,
      totalLiquidityUSD,
      myLiquidityUSD,
      onSelectAddLP,
      onSelectRemoveLP,
    ],
  )
  /**
   * harvest action
   */
  const renderHarvestActionAirDrop = useCallback(
    (className?: string, isHor?: boolean) => (
      <HarvestActionAirDrop isHorizontal={isHor} className={className} pid={pid} earnings={earnings} />
    ),
    [earnings, pid],
  )

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  if (isMobile) {
    return (
      <HorizontalMobileStyle className="mb-3">
        <CardHeadingAccordion
          farm={farm}
          lpLabel={lpTokenName}
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
  // if (isHorizontal) {
  // }

  // return (
  //   <VerticalStyle className="mb-7">
  //     <div className="flex flex-column flex-grow">
  //       {renderCardHeading('pt-7')}
  //       {renderStakeAction('pa-5')}
  //       {/* renderHarvestAction('pa-5') */}
  //       {renderHarvestActionAirDrop('pa-5 pt-0', isHorizontal)}
  //     </div>
  //     {renderDetailsSection('px-5 py-3', false)}
  //   </VerticalStyle>
  // )
}

export default FarmCard
