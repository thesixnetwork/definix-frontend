import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useConverter from 'hooks/useConverter'

import {
  Flex,
  Card,
  CardRibbon,
  IconButton,
  Box,
  ArrowBottomGIcon,
  ArrowTopGIcon,
  Divider,
  ColorStyles,
  useMatchBreakpoints,
  Grid,
} from 'definixswap-uikit'
import CardHeading from './CardHeading'
import { TotalLiquiditySection, MyBalanceSection, EarningsSection } from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import LinkListSection from './LinkListSection'
import { FarmCardProps } from './types'

const Wrap = styled(Box)`
  padding: ${({ theme }) => theme.spacing.S_32}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: ${({ theme }) => theme.spacing.S_20}px;
  }
`

const FarmCard: React.FC<FarmCardProps> = ({
  componentType = 'farm',
  farm,
  myBalancesInWallet,
  klaytn,
  removed,
  account,
  onSelectAddLP,
  onSelectRemoveLP,
}) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const { convertToPriceFromToken } = useConverter()
  const lpTokenName = useMemo(() => farm.lpSymbols.map((lpSymbol) => lpSymbol.symbol).join('-'), [farm.lpSymbols])
  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { earnings, tokenBalance, stakedBalance, allowance } = useFarmUser(pid)
  /**
   * total liquidity
   */
  const totalLiquidity: number = useMemo(() => farm.totalLiquidityValue, [farm.totalLiquidityValue])
  /**
   * my liquidity
   */
  const myLiquidity: BigNumber = useMemo(() => {
    const { lpTotalInQuoteToken, lpTotalSupply, quoteTokenBlanceLP, quoteTokenDecimals } = farm
    if (!lpTotalInQuoteToken) {
      return new BigNumber(0)
    }
    const ratio = new BigNumber(stakedBalance).div(new BigNumber(lpTotalSupply))
    const stakedTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(ratio)
      .times(new BigNumber(2))
    return convertToPriceFromToken(stakedTotalInQuoteToken, farm.quoteTokenSymbol)
  }, [farm, stakedBalance, convertToPriceFromToken])

  const renderCardHeading = useCallback(() => (
    <CardHeading
      farm={farm}
      lpLabel={lpTokenName}
      removed={removed}
      size="small"
    />
  ), [farm, lpTokenName, removed])

  const renderIconButton = useCallback(
    () => (
      <IconButton onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
        {isOpenAccordion ? <ArrowTopGIcon /> : <ArrowBottomGIcon />}
      </IconButton>
    ),
    [isOpenAccordion],
  )

  const renderTotalLiquiditySection = useCallback(
    () => <TotalLiquiditySection title={t('Total Liquidity')} totalLiquidity={totalLiquidity} />,
    [t, totalLiquidity],
  )
  const renderMyBalanceSection = useCallback(
    () => <MyBalanceSection title={t('Balance')} myBalances={myBalancesInWallet} />,
    [t, myBalancesInWallet],
  )
  const renderEarningsSection = useCallback(
    () => <EarningsSection title={t('Earned')} tokenName={lpTokenName} earnings={earnings} />,
    [t, lpTokenName, earnings],
  )

  /**
   * stake action
   */
  const isApproved = useMemo(() => {
    return account && !!farm.userData
  }, [farm, account])
  const hasAllowance = useMemo(() => {
    return isApproved && allowance && allowance.isGreaterThan(0)
  }, [isApproved, allowance])
  const onPresentDeposit = useCallback(() => {
    onSelectAddLP({
      pid,
      lpTokenName,
      tokenBalance,
      totalLiquidity,
      myLiquidity: stakedBalance,
      myLiquidityPrice: myLiquidity,
      farm,
      removed,
    })
  }, [
    farm,
    stakedBalance,
    myLiquidity,
    lpTokenName,
    pid,
    tokenBalance,
    totalLiquidity,
    onSelectAddLP,
    removed,
  ])
  const onPresentWithdraw = useCallback(() => {
    onSelectRemoveLP({
      pid,
      lpTokenName,
      tokenBalance,
      totalLiquidity,
      myLiquidity: stakedBalance,
      myLiquidityPrice: myLiquidity,
      farm,
      removed,
    })
  }, [
    farm,
    stakedBalance,
    myLiquidity,
    lpTokenName,
    pid,
    tokenBalance,
    totalLiquidity,
    onSelectRemoveLP,
    removed,
  ])
  const renderStakeAction = useCallback(
    () => (
      <StakeAction
        componentType={componentType}
        isApproved={isApproved}
        hasAllowance={hasAllowance}
        myLiquidity={stakedBalance}
        myLiquidityPrice={myLiquidity}
        lpSymbol={farm.lpSymbol}
        klaytn={klaytn}
        account={account}
        onPresentDeposit={onPresentDeposit}
        onPresentWithdraw={onPresentWithdraw}
      />
    ),
    [
      account,
      klaytn,
      farm,
      isApproved,
      hasAllowance,
      stakedBalance,
      componentType,
      onPresentDeposit,
      onPresentWithdraw,
      myLiquidity,
    ],
  )
  /**
   * harvest action
   */
  const renderHarvestActionAirDrop = useCallback(
    () => <HarvestActionAirDrop componentType={componentType} isMobile={isMobile} pid={pid} earnings={earnings} />,
    [isMobile, earnings, pid, componentType],
  )

  const renderLinkSection = useCallback(() => <LinkListSection lpAddresses={farm.lpAddresses} />, [farm.lpAddresses])

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  

  if (componentType === 'myInvestment') {
    return (
      <>
        <Wrap>
          <Grid gridTemplateColumns={isMobile ? '1fr' : '3fr 2.5fr 4fr'} gridGap={isMobile ? '16px' : '2rem'}>
            <Box>{renderCardHeading()}</Box>
            <Box>{renderStakeAction()}</Box>
            <Box>{isApproved && renderHarvestActionAirDrop()}</Box>
          </Grid>
        </Wrap>
      </>
    )
  }

  return (
    <>
      <Card ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />} mt="S_16">
        {isMobile ? (
          <>
            <Wrap>
              <Flex justifyContent="space-between">
                {renderCardHeading()}
                {renderIconButton()}
              </Flex>
              {renderEarningsSection()}
            </Wrap>
            {isOpenAccordion && (
              <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_20" py="S_24">
                {renderHarvestActionAirDrop()}
                <Box py="S_24">{renderStakeAction()}</Box>
                <Divider />
                <Box pt="S_24">{renderTotalLiquiditySection()}</Box>
                <Box pt="S_16">{renderMyBalanceSection()}</Box>
                <Box py="S_28">{renderLinkSection()}</Box>
              </Box>
            )}
          </>
        ) : (
          <>
            <Wrap>
              <Flex justifyContent="space-between">
                <Box style={{ width: '26%' }}>{renderCardHeading()}</Box>
                <Box style={{ width: '13%' }}>{renderTotalLiquiditySection()}</Box>
                <Box style={{ width: '26%' }} mx="S_24">
                  {renderMyBalanceSection()}
                </Box>
                <Box style={{ width: '22%' }}>{renderEarningsSection()}</Box>
                {renderIconButton()}
              </Flex>
            </Wrap>
            {isOpenAccordion && (
              <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_32" py="S_24">
                <Flex justifyContent="space-between">
                  <Box style={{ width: '20%' }}>{renderLinkSection()}</Box>
                  <Box style={{ width: '40%' }} mx="S_24">
                    {isApproved && renderHarvestActionAirDrop()}
                  </Box>
                  <Box style={{ width: '30%' }}>{renderStakeAction()}</Box>
                </Flex>
              </Box>
            )}
          </>
        )}
      </Card>
    </>
  )
}

export default FarmCard
