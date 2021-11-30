import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useConverter from 'hooks/useConverter'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
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
  const { convertToPriceFromToken, convertToUSD } = useConverter()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const lpTokenName = useMemo(() => {
    return (
      farm.lpSymbol &&
      farm.lpSymbol
        .toUpperCase()
        .replace(/(DEFINIX)|(LP)/g, '')
        .trim()
    )
  }, [farm.lpSymbol])

  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { earnings, tokenBalance, stakedBalance, allowance } = useFarmUser(pid)

  const addLiquidityUrl = useMemo(() => {
    const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
    const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
    return `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  }, [farm])

  const getTokenPrice = useCallback(
    (token) => {
      return convertToPriceFromToken(token, farm.quoteTokenSymbol)
    },
    [farm.quoteTokenSymbol, convertToPriceFromToken],
  )
  /**
   * total liquidity
   */
  const totalLiquidity: number = useMemo(() => farm.totalLiquidityValue, [farm.totalLiquidityValue])
  const totalLiquidityUSD = useMemo(() => convertToUSD(totalLiquidity), [totalLiquidity, convertToUSD])
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
    return getTokenPrice(stakedTotalInQuoteToken)
  }, [farm, stakedBalance, getTokenPrice])
  const myLiquidityUSD = useMemo(() => {
    return convertToUSD(myLiquidity)
  }, [convertToUSD, myLiquidity])

  const renderCardHeading = useCallback(
    () => (
      <CardHeading farm={farm} lpLabel={lpTokenName} removed={removed} addLiquidityUrl={addLiquidityUrl} size="small" />
    ),
    [addLiquidityUrl, farm, lpTokenName, removed],
  )

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
  const renderStakeAction = useCallback(
    () => (
      <StakeAction
        componentType={componentType}
        isApproved={isApproved}
        hasAllowance={hasAllowance}
        myLiquidity={stakedBalance}
        myLiquidityUSD={myLiquidityUSD}
        lpSymbol={farm.lpSymbol}
        klaytn={klaytn}
        account={account}
        onPresentDeposit={() => {
          onSelectAddLP({
            pid,
            tokenName: lpTokenName,
            tokenBalance,
            addLiquidityUrl,
            totalLiquidity: totalLiquidityUSD,
            myLiquidity: stakedBalance,
            myLiquidityUSD,
            farm,
            removed,
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
            farm,
            removed,
          })
        }}
      />
    ),
    [
      account,
      klaytn,
      farm,
      isApproved,
      hasAllowance,
      stakedBalance,
      lpTokenName,
      pid,
      tokenBalance,
      addLiquidityUrl,
      totalLiquidityUSD,
      myLiquidityUSD,
      onSelectAddLP,
      onSelectRemoveLP,
      removed,
      componentType,
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

  const Wrap = styled(Box)`
    padding: ${({ theme }) => theme.spacing.S_32}px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      padding: ${({ theme }) => theme.spacing.S_20}px;
    }
  `

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
