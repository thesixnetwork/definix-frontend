import BigNumber from 'bignumber.js'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import PoolContext from 'views/Pools/PoolContext'
import DepositModal from '../DepositModal'
import PoolSash from '../PoolSash'
import WithdrawModal from '../WithdrawModal'
import CardHeading from './CardHeading'
import DetailsSection from './DetailsSection'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'
import { PoolCardProps } from './types'

const VerticalStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  display: flex;
  position: relative;
  align-self: baseline;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
`

const HorizontalStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  display: flex;
  position: relative;
`

const PoolCard: React.FC<PoolCardProps> = ({ pool, isHorizontal = false }) => {
  const {
    sousId,
    tokenName,
    stakingTokenName,
    stakingTokenAddress,
    apy,
    tokenDecimals,
    poolCategory,
    totalStaked,
    isFinished,
    userData,
    stakingLimit,
  } = pool

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP

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
    if (isFinished && sousId !== 0) {
      return <PoolSash type="finish" />
    }

    return null
  }

  const renderCardHeading = useCallback(
    (className?: string) => (
      <CardHeading
        tokenName={tokenName}
        isOldSyrup={isOldSyrup}
        apy={apy}
        isHorizontal={isHorizontal}
        className={className}
      />
    ),
    [apy, isHorizontal, isOldSyrup, tokenName],
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

  const renderHarvestAction = useCallback(
    (className?: string) => (
      <HarvestAction
        sousId={sousId}
        isBnbPool={isBnbPool}
        earnings={earnings}
        tokenDecimals={tokenDecimals}
        needsApproval={needsApproval}
        isOldSyrup={isOldSyrup}
        className={className}
      />
    ),
    [earnings, isBnbPool, isOldSyrup, needsApproval, sousId, tokenDecimals],
  )

  const renderDetailsSection = useCallback(
    (className?: string) => (
      <DetailsSection
        tokenName={tokenName}
        bscScanAddress=""
        totalStaked={totalStaked}
        isHorizontal={isHorizontal}
        className={className}
      />
    ),
    [isHorizontal, tokenName, totalStaked],
  )

  if (isHorizontal) {
    return (
      <HorizontalStyle className="flex align-stretch px-5 py-6 mb-4">
        {renderSash()}
        {renderCardHeading('col-3 pos-static')}

        <div className="col-5 bd-x flex flex-column justify-space-between px-5">
          {renderStakeAction('pb-5')}
          {renderDetailsSection()}
        </div>

        {renderHarvestAction('col-4 pl-5 flex-grow')}
      </HorizontalStyle>
    )
  }

  return (
    <VerticalStyle className="mb-7">
      {renderSash()}
      {renderCardHeading('pt-7')}
      {renderStakeAction('pa-5')}
      {renderHarvestAction('pa-5')}
      {renderDetailsSection('px-5 py-3')}
    </VerticalStyle>
  )
}

export default PoolCard
