import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { useFarmUser } from 'state/hooks'
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
// import PoolSash from '../PoolSash'
import CardHeading from './CardHeading'
import { TotalStakedSection, MyBalanceSection, EarningsSection } from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import LinkListSection from './LinkListSection'
import { PoolCardProps } from './types'

const PoolCard: React.FC<PoolCardProps> = ({
  componentType = 'pool',
  pool,
  myBalanceInWallet,
  onSelectAdd,
  onSelectRemove,
}) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const isInMyInvestment = useMemo(() => componentType === 'myInvestment', [componentType])
  const {
    sousId,
    tokenName,
    stakingTokenName,
    stakingTokenAddress,
    apy,
    farm,
    tokenDecimals,
    poolCategory,
    totalStaked,
    isFinished,
    userData,
    stakingLimit,
  } = pool
  const { pendingRewards } = useFarmUser(farm.pid)
  const { bundleRewardLength, bundleRewards } = farm

  const isBnbPool = poolCategory === PoolCategory.KLAYTN
  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP

  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const allowance = new BigNumber(userData?.allowance || 0)
  const earnings = useMemo(() => new BigNumber(userData?.pendingReward || 0), [userData?.pendingReward])
  const stakedBalance = useMemo(() => new BigNumber(userData?.stakedBalance || 0), [userData?.stakedBalance])
  const stakingTokenBalance = useMemo(
    () => new BigNumber(userData?.stakingTokenBalance || 0),
    [userData?.stakingTokenBalance],
  )
  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(tokenDecimals))

  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool

  // const renderSash = () => {
  //   if (tokenName === 'FINIX-SIX' && !isFinished) {
  //     return <PoolSash type="special" />
  //   }
  //   if (isFinished && sousId !== 0 && sousId !== 1) {
  //     return <PoolSash type="finish" />
  //   }

  //   return null
  // }

  const renderCardHeading = useCallback(
    () => <CardHeading tokenName={tokenName} isOldSyrup={isOldSyrup} apy={apy} size={isInMyInvestment && 'small'} />,
    [tokenName, isOldSyrup, apy, isInMyInvestment],
  )
  const renderToggleButton = useCallback(
    () => (
      <IconButton onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
        {isOpenAccordion ? <ArrowTopGIcon /> : <ArrowBottomGIcon />}
      </IconButton>
    ),
    [isOpenAccordion],
  )
  const renderTotalStakedSection = useCallback(
    () => <TotalStakedSection title={t('Total staked')} tokenName={tokenName} totalStaked={totalStaked} />,
    [t, tokenName, totalStaked],
  )

  const renderMyBalanceSection = useCallback(
    () => (
      <>
        {!myBalanceInWallet || myBalanceInWallet === null ? null : (
          <MyBalanceSection title={t('Balance')} tokenName={tokenName} myBalance={myBalanceInWallet} />
        )}
      </>
    ),
    [t, tokenName, myBalanceInWallet],
  )
  const renderEarningsSection = useCallback(
    () => <EarningsSection title={t('Earned')} tokenName={tokenName} earnings={earnings} />,
    [t, tokenName, earnings],
  )

  const onPresentDeposit = useCallback(() => {
    onSelectAdd({
      isOldSyrup,
      isBnbPool,
      sousId,
      tokenName: stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName,
      totalStaked,
      myStaked: stakedBalance,
      max: stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance,
      apy,
    })
  }, [
    isOldSyrup,
    sousId,
    stakedBalance,
    stakingLimit,
    stakingTokenName,
    stakingTokenBalance,
    convertedLimit,
    onSelectAdd,
    isBnbPool,
    totalStaked,
    apy,
  ])
  const onPresentWithdraw = useCallback(() => {
    onSelectRemove({
      sousId,
      isOldSyrup,
      tokenName: stakingTokenName,
      totalStaked,
      myStaked: stakedBalance,
      max: stakedBalance,
      apy,
    })
  }, [isOldSyrup, sousId, stakedBalance, stakingTokenName, onSelectRemove, totalStaked, apy])
  const renderStakeAction = useCallback(
    () => (
      <StakeAction
        componentType={componentType}
        isOldSyrup={isOldSyrup}
        isFinished={isFinished}
        sousId={sousId}
        tokenName={tokenName}
        stakingTokenAddress={stakingTokenAddress}
        stakedBalance={stakedBalance}
        needsApproval={needsApproval}
        onPresentDeposit={onPresentDeposit}
        onPresentWithdraw={onPresentWithdraw}
      />
    ),
    [
      isFinished,
      isOldSyrup,
      needsApproval,
      sousId,
      stakedBalance,
      stakingTokenAddress,
      tokenName,
      onPresentDeposit,
      onPresentWithdraw,
      componentType,
    ],
  )
  const renderHarvestActionAirDrop = useCallback(
    () => (
      <HarvestActionAirDrop
        componentType={componentType}
        isMobile={isMobile}
        isBnbPool={isBnbPool}
        isOldSyrup={isOldSyrup}
        bundleRewards={bundleRewards}
        pendingRewards={pendingRewards}
        sousId={sousId}
        earnings={earnings}
        needsApproval={needsApproval}
      />
    ),
    [earnings, isBnbPool, isOldSyrup, needsApproval, sousId, pendingRewards, bundleRewards, isMobile, componentType],
  )
  const renderLinkSection = useCallback(() => <LinkListSection isMobile={isMobile} klaytnScopeAddress="" />, [isMobile])

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  const Wrap = styled(Box)`
    padding: ${({ theme }) => theme.spacing.S_32}px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      padding: ${({ theme }) => theme.spacing.S_20}px;
    }
  `

  if (isInMyInvestment) {
    return (
      <>
        <Wrap>
          <Grid gridTemplateColumns={isMobile ? '1fr' : '3fr 2.5fr 4fr'} gridGap={isMobile ? '16px' : '2rem'}>
            <Box>{renderCardHeading()}</Box>
            <Box>{renderStakeAction()}</Box>
            <Box>{renderHarvestActionAirDrop()}</Box>
          </Grid>
        </Wrap>
      </>
    )
  }

  return (
    <Card ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />} mt="S_16">
      {isMobile ? (
        <>
          <Wrap>
            <Flex justifyContent="space-between">
              {renderCardHeading()}
              {renderToggleButton()}
            </Flex>
            {renderEarningsSection()}
          </Wrap>
          {isOpenAccordion && (
            <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_20" py="S_24">
              {renderHarvestActionAirDrop()}
              <Box py="S_24">{renderStakeAction()}</Box>
              <Divider />
              <Box pt="S_24">{renderTotalStakedSection()}</Box>
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
              <Box style={{ width: '16%' }}>{renderTotalStakedSection()}</Box>
              <Box style={{ width: '26%' }} mx="S_24">
                {renderMyBalanceSection()}
              </Box>
              <Box style={{ width: '24%' }}>{renderEarningsSection()}</Box>
              {renderToggleButton()}
            </Flex>
          </Wrap>
          {isOpenAccordion && (
            <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_32" py="S_24">
              <Flex justifyContent="space-between">
                <Box style={{ width: '20%' }}>{renderLinkSection()}</Box>
                <Box style={{ width: '40%' }} mx="S_24">
                  {renderHarvestActionAirDrop()}
                </Box>
                <Box style={{ width: '30%' }}>{renderStakeAction()}</Box>
              </Flex>
            </Box>
          )}
        </>
      )}
    </Card>
  )
}

export default PoolCard
