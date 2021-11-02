import BigNumber from 'bignumber.js'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'
import { Flex, ChevronDownIcon, ChevronUpIcon } from 'definixswap-uikit'
import PoolContext from 'views/Pools/PoolContext'
import DepositModal from '../DepositModal'
import PoolSash from '../PoolSash'
import WithdrawModal from '../WithdrawModal'
import CardHeading from './CardHeading'
import CardHeadingAccordion from './CardHeadingAccordion'
import DetailsSection from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
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

const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
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

  const { onPresent } = useContext(PoolContext)

  const { onStake } = useSousStake(sousId, isBnbPool)
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

  const renderDepositModal = useCallback(() => {
    onPresent(
      <DepositModal
        max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
        onConfirm={onStake}
        tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
        renderCardHeading={renderCardHeading}
      />,
    )
  }, [convertedLimit, onPresent, onStake, renderCardHeading, stakingLimit, stakingTokenBalance, stakingTokenName])

  const renderWithdrawModal = useCallback(() => {
    onPresent(
      <WithdrawModal
        max={stakedBalance}
        onConfirm={onUnstake}
        tokenName={stakingTokenName}
        renderCardHeading={renderCardHeading}
      />,
    )
  }, [onPresent, onUnstake, renderCardHeading, stakedBalance, stakingTokenName])

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
        onPresentDeposit={renderDepositModal}
        onPresentWithdraw={renderWithdrawModal}
        className={className}
      />
    ),
    [
      isFinished,
      isOldSyrup,
      needsApproval,
      onUnstake,
      renderDepositModal,
      renderWithdrawModal,
      sousId,
      stakedBalance,
      stakingTokenAddress,
      tokenName,
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
          {renderStakeAction('pb-4')}
          {/* {renderHarvestActionAirDrop('col-5 pl-5 flex-grow', true)} */}
        </Flex>
      )}
    </>
  )
}

export default PoolCard
