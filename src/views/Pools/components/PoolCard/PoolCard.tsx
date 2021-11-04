import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PoolCategory, QuoteToken } from 'config/constants/types'

import { useFarmUser } from 'state/hooks'
import { useMatchBreakpoints } from 'uikit-dev'
import {
  Flex,
  Card,
  CardBody,
  CardRibbon,
  IconButton,
  Box,
  ArrowBottomGIcon,
  ArrowTopGIcon,
  Text,
  ColorStyles,
} from 'definixswap-uikit'
// import PoolSash from '../PoolSash'
import CardHeading from './CardHeading'
// import CardHeadingAccordion from './CardHeadingAccordion'
import { TotalStakedSection, MyBalanceSection, EarningsSection } from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import LinkListSection from './LinkListSection'
import { PoolCardProps } from './types'

const PoolCard: React.FC<PoolCardProps> = ({ pool, onSelectAdd, onSelectRemove }) => {
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

  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
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
    () => <CardHeading tokenName={tokenName} isOldSyrup={isOldSyrup} apy={apy} />,
    [tokenName, isOldSyrup, apy],
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
  const renderTotalStakedSection = useCallback(
    () => <TotalStakedSection title="Total Staked" tokenName={tokenName} totalStaked={totalStaked} />,
    [tokenName, totalStaked],
  )
  const renderMyBalanceSection = useCallback(
    () => <MyBalanceSection title="Balance" tokenName={tokenName} balance={stakedBalance} />,
    [tokenName, stakedBalance],
  )
  const renderEarningsSection = useCallback(
    () => <EarningsSection title="Earned" tokenName={tokenName} earnings={earnings} />,
    [tokenName, earnings],
  )

  const renderStakeAction = useCallback(
    () => (
      <StakeAction
        sousId={sousId}
        isOldSyrup={isOldSyrup}
        tokenName={tokenName}
        stakingTokenAddress={stakingTokenAddress}
        stakedBalance={stakedBalance}
        needsApproval={needsApproval}
        isFinished={isFinished}
        onPresentDeposit={() => {
          onSelectAdd({
            sousId,
            isBnbPool,
            tokenName: stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName,
            totalStaked,
            myStaked: stakedBalance,
            max:
              stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance,
          })
        }}
        onPresentWithdraw={() => {
          onSelectRemove({
            sousId,
            isOldSyrup,
            tokenName: stakingTokenName,
            totalStaked,
            myStaked: stakedBalance,
            max: stakedBalance,
          })
        }}
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
      stakingLimit,
      stakingTokenName,
      stakingTokenBalance,
      convertedLimit,
      onSelectAdd,
      onSelectRemove,
      isBnbPool,
      totalStaked,
    ],
  )

  const renderHarvestActionAirDrop = useCallback(
    () => (
      <HarvestActionAirDrop
        isMobile={isMobile}
        bundleRewards={bundleRewards}
        pendingRewards={pendingRewards}
        sousId={sousId}
        isBnbPool={isBnbPool}
        earnings={earnings}
        needsApproval={needsApproval}
        isOldSyrup={isOldSyrup}
        pool={pool}
      />
    ),
    [earnings, isBnbPool, isOldSyrup, needsApproval, sousId, pool, pendingRewards, bundleRewards, isMobile],
  )

  const renderLinkSection = useCallback(() => <LinkListSection isMobile={isMobile} klaytnScopeAddress="" />, [isMobile])

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  if (isMobile) {
    return (
      <Card ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />} className="mt-s16">
        <CardBody>
          <Flex justifyContent="space-between">
            {renderCardHeading()}
            {renderIconButton()}
          </Flex>
          {renderEarningsSection()}
        </CardBody>
        {isOpenAccordion && (
          <Box backgroundColor={ColorStyles.LIGHTGREY_20} className="px-s20 py-s24">
            {renderHarvestActionAirDrop()}
            <Box className="py-s24">{renderStakeAction()}</Box>
            <Box backgroundColor={ColorStyles.LIGHTBROWN_20} height="1px" />
            <Box className="pt-s24">{renderTotalStakedSection()}</Box>
            <Box className="pt-s16">{renderMyBalanceSection()}</Box>
            <Box className="py-s32">{renderLinkSection()}</Box>
          </Box>
        )}
      </Card>
      // <HorizontalMobileStyle className="mb-3">
      //   {/* <CardHeadingAccordion
      //     tokenName={tokenName}
      //     isOldSyrup={isOldSyrup}
      //     apy={apy}
      //     className=""
      //     isOpenAccordion={isOpenAccordion}
      //     setIsOpenAccordion={setIsOpenAccordion}
      //   /> */}

      //   <div className={`accordion-content ${isOpenAccordion ? 'show' : 'hide'}`}>
      //     {renderStakeAction()}
      //     {/* {renderHarvestAction('pa-5')} */}
      //     {renderHarvestActionAirDrop('pa-5 pt-0', false)}
      //     {renderDetailsSection()}
      //     {renderLinkSection()}
      //   </div>
      // </HorizontalMobileStyle>
    )
  }

  return (
    <Card ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />} className="mt-s16">
      <CardBody>
        <Flex justifyContent="space-between">
          <Box style={{ width: '26%' }}>{renderCardHeading()}</Box>
          <Box style={{ width: '16%' }}>{renderTotalStakedSection()}</Box>
          <Box style={{ width: '26%' }} className="mx-s24">
            {renderMyBalanceSection()}
          </Box>
          <Box style={{ width: '24%' }}>{renderEarningsSection()}</Box>
          {renderIconButton()}
        </Flex>
      </CardBody>
      {isOpenAccordion && (
        <Box backgroundColor={ColorStyles.LIGHTGREY_20} className="py-s24 px-s32">
          <Flex justifyContent="space-between">
            <Box style={{ width: '20%' }}>{renderLinkSection()}</Box>
            <Box style={{ width: '40%' }} className="mx-s24">
              {renderHarvestActionAirDrop()}
            </Box>
            <Box style={{ width: '30%' }}>{renderStakeAction()}</Box>
          </Flex>
        </Box>
      )}
    </Card>
  )
}

export default PoolCard
