import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useConverter from 'hooks/useConverter'
import { getContract } from 'utils/erc20'
import { getAddress } from 'utils/addressHelpers'
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
  const { pid, lpAddresses } = useFarmFromSymbol(farm.lpSymbol)
  const { earnings, tokenBalance, stakedBalance, allowance } = useFarmUser(pid)
  const lpContract = useMemo(() => getContract(klaytn as provider, getAddress(lpAddresses)), [klaytn, lpAddresses])
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
  const hasAccount = useMemo(() => account && !!farm.userData, [farm, account])
  const hasAllowance = useMemo(() => allowance && allowance.isGreaterThan(0), [allowance])
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
        hasAccount={hasAccount}
        hasAllowance={hasAllowance}
        myLiquidity={stakedBalance}
        myLiquidityPrice={myLiquidity}
        lpContract={lpContract}
        onPresentDeposit={onPresentDeposit}
        onPresentWithdraw={onPresentWithdraw}
      />
    ),
    [
      componentType,
      hasAccount,
      hasAllowance,
      stakedBalance,
      myLiquidity,
      lpContract,
      onPresentDeposit,
      onPresentWithdraw,
    ],
  )
  /**
   * harvest action
   */
  const renderHarvestAction = useCallback(
    () => <HarvestActionAirDrop componentType={componentType} pid={pid} earnings={earnings} />,
    [earnings, pid, componentType],
  )

  const renderLinkSection = useCallback(() => <LinkListSection lpAddresses={lpAddresses} />, [lpAddresses])

  if (componentType === 'myInvestment') {
    return (
      <>
        <Wrap>
          <Grid gridTemplateColumns={isMobile ? '1fr' : '3fr 2.5fr 4fr'} gridGap={isMobile ? '16px' : '2rem'}>
            <Box>{renderCardHeading()}</Box>
            <Box>{renderStakeAction()}</Box>
            <Box>{renderHarvestAction()}</Box>
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
                {renderHarvestAction()}
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
                <Box style={{ width: '236px' }}>{renderCardHeading()}</Box>
                <Box style={{ width: '112px' }}>{renderTotalLiquiditySection()}</Box>
                <Box style={{ width: '232px' }} mx="S_24">{renderMyBalanceSection()}</Box>
                <Box style={{ width: '200px' }}>{renderEarningsSection()}</Box>
                {renderIconButton()}
              </Flex>
            </Wrap>
            {isOpenAccordion && (
              <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_32" py="S_24">
                <Flex justifyContent="space-between">
                  <Box style={{ width: '166px' }}>{renderLinkSection()}</Box>
                  <Box style={{ width: '358px' }} mx="S_24">{renderHarvestAction()}</Box>
                  <Box style={{ width: '276px' }}>{renderStakeAction()}</Box>
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
