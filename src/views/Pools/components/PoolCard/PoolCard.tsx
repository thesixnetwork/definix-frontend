import BigNumber from 'bignumber.js'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PoolCategory, QuoteToken } from 'config/constants/types'

import { useSousUnstake } from 'hooks/useUnstake'
import { useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'
import { Flex, ChevronDownIcon, ChevronUpIcon } from 'definixswap-uikit'
import PoolContext from 'views/Pools/PoolContext'
import PoolSash from '../PoolSash'
import CardHeading from './CardHeading'
import CardHeadingAccordion from './CardHeadingAccordion'
import DetailsSection from './DetailsSection'
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

const PoolCard: React.FC<PoolCardProps> = ({ pool, onSelectAddLP, onSelectRemoveLP }) => {
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

  const { onUnstake } = useSousUnstake(sousId)

  const renderSash = () => {
    if (tokenName === 'FINIX-SIX' && !isFinished) {
      return <PoolSash type="special" />
    }
    if (isFinished && sousId !== 0 && sousId !== 1) {
      return <PoolSash type="finish" />
    }

    return null
  }

  const renderCardHeading = useCallback(
    (className?: string) => (
      <CardHeading tokenName={tokenName} isOldSyrup={isOldSyrup} apy={apy} className={className} />
    ),
    [apy, isOldSyrup, tokenName],
  )

  // const renderWithdrawModal = useCallback(() => {
  //   onPresent(
  //     <WithdrawModal
  //       max={stakedBalance}
  //       onConfirm={onUnstake}
  //       tokenName={stakingTokenName}
  //       renderCardHeading={renderCardHeading}
  //     />,
  //   )
  // }, [onPresent, onUnstake, renderCardHeading, stakedBalance, stakingTokenName])

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
        onUnstake={onUnstake}
        onPresentDeposit={() => {
          onSelectAddLP({
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
          // onPresentWithdraw
        }}
        className={className}
      />
    ),
    [
      isFinished,
      isOldSyrup,
      needsApproval,
      onUnstake,
      sousId,
      stakedBalance,
      stakingTokenAddress,
      tokenName,
      stakingLimit,
      stakingTokenName,
      stakingTokenBalance,
      convertedLimit,
      onSelectAddLP,
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
      <DetailsSection
        isMobile={isMobile}
        tokenName={tokenName}
        totalStaked={totalStaked}
        balance={stakedBalance}
        earnings={earnings}
        klaytnScopeAddress=""
      />
    ),
    [isMobile, tokenName, totalStaked, stakedBalance, earnings],
  )

  const renderLinkSection = useCallback(() => <LinkListSection isMobile={isMobile} klaytnScopeAddress="" />, [isMobile])

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  if (isMobile) {
    return (
      <HorizontalMobileStyle className="mb-3">
        {renderSash()}
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
      <Flex justifyContent="space-between" style={{ backgroundColor: 'coral', marginBottom: '10px' }}>
        {renderSash()}
        {renderCardHeading('col-3 pos-static')}

        <Flex>{renderDetailsSection()}</Flex>

        <button type="button" onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
          {isOpenAccordion ? <ChevronUpIcon color="textSubtle" /> : <ChevronDownIcon color="textSubtle" />}
        </button>

        {/* {renderHarvestAction('col-5 pl-5 flex-grow')} */}
      </Flex>
      {isOpenAccordion && (
        <Flex>
          {renderLinkSection()}
          {renderHarvestActionAirDrop('col-5 pl-5 flex-grow', true)}
          {renderStakeAction('pb-4')}
        </Flex>
      )}
    </>
  )
}

export default PoolCard
