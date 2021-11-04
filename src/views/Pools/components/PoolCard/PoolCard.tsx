import BigNumber from 'bignumber.js'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PoolCategory, QuoteToken } from 'config/constants/types'

import { useFarmUser } from 'state/hooks'
import styled from 'styled-components'
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
import PoolSash from '../PoolSash'
import CardHeading from './CardHeading'
import CardHeadingAccordion from './CardHeadingAccordion'
import { TotalStakedSection, MyBalanceSection, EarningsSection } from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import LinkListSection from './LinkListSection'
import { PoolCardProps } from './types'

const CardStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
`

const HorizontalMobileStyle = styled(CardStyle)`
  position: relative;

  .accordion-content {
    &.hide {
      display: none;
    }

    &.show {
      display: block;
    }
  }
`

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
    (className?: string) => (
      <Box style={{ width: '26%' }}>
        <CardHeading tokenName={tokenName} isOldSyrup={isOldSyrup} apy={apy} className={className} />
      </Box>
    ),
    [apy, isOldSyrup, tokenName],
  )

  const renderStakeAction = useCallback(
    (className?: string) => (
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
        className={className}
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
    (className?: string, isHor?: boolean) => (
      <HarvestActionAirDrop
        bundleRewards={bundleRewards}
        bundleRewardLength={bundleRewardLength}
        pendingRewards={pendingRewards}
        sousId={sousId}
        isBnbPool={isBnbPool}
        earnings={earnings}
        tokenDecimals={tokenDecimals}
        needsApproval={needsApproval}
        isOldSyrup={isOldSyrup}
        className={className}
        isHorizontal={isHor}
        farm={farm}
        pool={pool}
      />
    ),
    [
      earnings,
      isBnbPool,
      isOldSyrup,
      needsApproval,
      sousId,
      tokenDecimals,
      farm,
      pool,
      pendingRewards,
      bundleRewardLength,
      bundleRewards,
    ],
  )

  const renderDetailsSection = useCallback(
    () => (
      <>
        <Box style={{ width: '16%' }}>
          <TotalStakedSection title="Total Staked" tokenName={tokenName} totalStaked={totalStaked}/>
        </Box>
        <Box mx={24} style={{ width: '26%' }}>
          <MyBalanceSection title="Balance" tokenName={tokenName} balance={stakedBalance}/>
        </Box>
        <Box style={{ width: '24%' }}>
          <EarningsSection title="Earned" tokenName={tokenName} earnings={earnings}/>
        </Box>
      </>
    ),
    [tokenName, totalStaked, stakedBalance, earnings],
  )

  const renderLinkSection = useCallback(() => <LinkListSection isMobile={isMobile} klaytnScopeAddress="" />, [isMobile])

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  if (isMobile) {
    return (
      <HorizontalMobileStyle className="mb-3">
        {/* <CardHeadingAccordion
          tokenName={tokenName}
          isOldSyrup={isOldSyrup}
          apy={apy}
          className=""
          isOpenAccordion={isOpenAccordion}
          setIsOpenAccordion={setIsOpenAccordion}
        /> */}
        <div className={`accordion-content ${isOpenAccordion ? 'show' : 'hide'}`}>
          {renderStakeAction('pa-5')}
          {/* {renderHarvestAction('pa-5')} */}
          {renderHarvestActionAirDrop('pa-5 pt-0', false)}
          {renderDetailsSection()}
          {renderLinkSection()}
        </div>
      </HorizontalMobileStyle>
    )
  }

  return (
    <>
      <Card ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />}>
        <CardBody>
          <Flex justifyContent="space-between">
            {renderCardHeading()}

            {renderDetailsSection()}

            <IconButton
              variant="transparent"
              startIcon={isOpenAccordion ? <ArrowTopGIcon /> : <ArrowBottomGIcon />}
              onClick={() => setIsOpenAccordion(!isOpenAccordion)}
            />

            {/* {renderHarvestAction('col-5 pl-5 flex-grow')} */}
          </Flex>
        </CardBody>
        {isOpenAccordion && (
          <Box p={24} backgroundColor={ColorStyles.LIGHTGREY_20}>
            {/* <Box bg="lightGrey20">sdf</Box>
            <Text color="lightGrey20">dddddd</Text> */}
            <Flex>
              {renderLinkSection()}
              {renderHarvestActionAirDrop('col-5 pl-5 flex-grow', true)}
              {renderStakeAction('pb-4')}
            </Flex>
          </Box>
        )}
      </Card>
    </>
  )
}

export default PoolCard
