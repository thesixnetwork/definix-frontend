import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useConverter from 'hooks/useConverter'
import styled from 'styled-components'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import {
  Flex,
  Card,
  CardBody,
  CardRibbon,
  IconButton,
  Box,
  ArrowBottomGIcon,
  ArrowTopGIcon,
  Divider,
  ColorStyles,
  useMatchBreakpoints,
} from 'definixswap-uikit'
import CardHeading from './CardHeading'
// import CardHeadingAccordion from './CardHeadingAccordion'
import { TotalLiquiditySection, MyBalanceSection, EarningsSection } from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import { FarmCardProps } from './types'

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
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const lpTokenName = useMemo(() => {
    return farm.lpSymbol && farm.lpSymbol.toUpperCase().replace(/(DEFINIX)|(LP)/g, '').trim()
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
    () => (
      <CardHeading
        farm={farm}
        lpLabel={lpTokenName}
        removed={removed}
        addLiquidityUrl={addLiquidityUrl}
        finixPrice={finixPrice}
      />
    ),
    [addLiquidityUrl, farm, finixPrice, lpTokenName, removed],
  )

  const renderIconButton = useCallback(
    () => (
      <IconButton
        variant="transparent"
        startIcon={isOpenAccordion ? <ArrowTopGIcon /> : <ArrowBottomGIcon />}
        onClick={() => setIsOpenAccordion(!isOpenAccordion)}
      />
    ),
    [isOpenAccordion],
  )

  const renderTotalLiquiditySection = useCallback(
    () => <TotalLiquiditySection title="Total Staked" tokenName={lpTokenName} totalLiquidity={totalLiquidity} />,
    [lpTokenName, totalLiquidity],
  )
  const renderMyBalanceSection = useCallback(
    () => <MyBalanceSection title="Balance" tokenName={lpTokenName} balance={stakedBalance} />,
    [lpTokenName, stakedBalance],
  )
  const renderEarningsSection = useCallback(
    () => <EarningsSection title="Earned" tokenName={lpTokenName} earnings={earnings} />,
    [lpTokenName, earnings],
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
      // <HorizontalMobileStyle className="mb-3">
      //   <CardHeadingAccordion
      //     farm={farm}
      //     lpLabel={lpTokenName}
      //     removed={removed}
      //     addLiquidityUrl={addLiquidityUrl}
      //     finixPrice={finixPrice}
      //     className=""
      //     isOpenAccordion={isOpenAccordion}
      //     setIsOpenAccordion={setIsOpenAccordion}
      //   />
      //   <div className={`accordion-content ${isOpenAccordion ? 'show' : 'hide'}`}>
      //     {renderStakeAction('pa-5')}
      //     {/* renderHarvestAction('pa-5') */}
      //     {renderHarvestActionAirDrop('pa-5 pt-0', false)}
      //     {renderDetailsSection('px-5 py-3', false)}
      //   </div>
      // </HorizontalMobileStyle>
      <div>d</div>
    )
  }

  return (
    <Card ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />} className="mt-s16">
      <CardBody>
        <Flex justifyContent="space-between" >
          <Box style={{ width: '26%' }}>{renderCardHeading()}</Box>
          <Box style={{ width: '13%' }}>{renderTotalLiquiditySection()}</Box>
          <Box style={{ width: '26%' }} className="mx-s24">
            {renderMyBalanceSection()}
          </Box>
          <Box style={{ width: '22%' }}>{renderEarningsSection()}</Box>
          {renderIconButton()}
        </Flex>
      </CardBody>
      {isOpenAccordion && (
        <Box backgroundColor={ColorStyles.LIGHTGREY_20} className="py-s24 px-s32">
          <Flex justifyContent="space-between">
            {/* <Box style={{ width: '20%' }}>{renderLinkSection()}</Box> */}
            <Box style={{ width: '40%' }} className="mx-s24">
              {isApproved && renderHarvestActionAirDrop()}
            </Box>
            <Box style={{ width: '30%' }}>{renderStakeAction()}</Box>
          </Flex>
        </Box>
      )}
    </Card>
  )
}

export default FarmCard
