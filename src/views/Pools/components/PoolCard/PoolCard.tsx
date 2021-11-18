import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { useFarmUser } from 'state/hooks'
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
// import PoolSash from '../PoolSash'
import CardHeading from './CardHeading'
// import CardHeadingAccordion from './CardHeadingAccordion'
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
  onSelectRemove
}) => {
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
    () => (
      <>
        {!myBalanceInWallet || myBalanceInWallet === null ? null : (
          <MyBalanceSection title="Balance" tokenName={tokenName} myBalance={myBalanceInWallet} />
        )}
      </>
    ),
    [tokenName, myBalanceInWallet],
  )
  const renderEarningsSection = useCallback(
    () => <EarningsSection title="Earned" tokenName={tokenName} earnings={earnings} />,
    [tokenName, earnings],
  )

  const onPresentDeposit = useCallback(() => {
    onSelectAdd({
      isOldSyrup,
      isBnbPool,
      sousId,
      tokenName: stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName,
      totalStaked,
      myStaked: stakedBalance,
      max:
        stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance,
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
    apy
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
  }, [
    isOldSyrup,
    sousId,
    stakedBalance,
    stakingTokenName,
    onSelectRemove,
    totalStaked,
    apy
  ])
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
      componentType
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
    [
      earnings,
      isBnbPool,
      isOldSyrup,
      needsApproval,
      sousId,
      pendingRewards,
      bundleRewards,
      isMobile,
      componentType
    ],
  )
  const renderLinkSection = useCallback(() => <LinkListSection isMobile={isMobile} klaytnScopeAddress="" />, [isMobile])

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  if (isInMyInvestment) {
    return (
      <>
        {isMobile ? null : (
          <Box className="pa-s32">
            <Flex justifyContent="space-between">
              <Box style={{ width: '30%' }}>{renderCardHeading()}</Box>
              <Box style={{ width: '26%' }} className="mx-s24">
                {renderStakeAction()}
              </Box>
              <Box style={{ width: '44%' }}>{renderHarvestActionAirDrop()}</Box>
            </Flex>
          </Box>
        )}
      </>
    )
  }

  return (
    <Card ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />} className="mt-s16">
      {isMobile ? (
        <>
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
              <Divider />
              <Box className="pt-s24">{renderTotalStakedSection()}</Box>
              <Box className="pt-s16">{renderMyBalanceSection()}</Box>
              <Box className="py-s32">{renderLinkSection()}</Box>
            </Box>
          )}
        </>
      ) : (
        <>
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
        </>
      )}
    </Card>
  )
}

export default PoolCard
