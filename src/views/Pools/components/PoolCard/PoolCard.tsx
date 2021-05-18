import BigNumber from 'bignumber.js'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import React from 'react'
import styled from 'styled-components'
import { useModal } from 'uikit-dev'
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
  const earnings = new BigNumber(userData?.pendingReward || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(tokenDecimals))

  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool

  const renderSash = () => {
    if (tokenName === 'FINIX-SIX' && !isFinished) {
      return <PoolSash type="special" />
    }
    if (isFinished && sousId !== 0) {
      return <PoolSash type="finish" />
    }

    return null
  }

  const renderCardHeading = (className?: string) => (
    <CardHeading
      tokenName={tokenName}
      isOldSyrup={isOldSyrup}
      apy={apy}
      isHorizontal={isHorizontal}
      className={className}
    />
  )

  const renderStakeAction = (className?: string) => (
    <StakeAction
      sousId={sousId}
      isOldSyrup={isOldSyrup}
      tokenName={tokenName}
      stakingTokenAddress={stakingTokenAddress}
      stakedBalance={stakedBalance}
      needsApproval={needsApproval}
      isFinished={isFinished}
      onUnstake={onUnstake}
      onPresentDeposit={onPresentDeposit}
      onPresentWithdraw={onPresentWithdraw}
      className={className}
    />
  )

  const renderHarvestAction = (className?: string) => (
    <HarvestAction
      sousId={sousId}
      isBnbPool={isBnbPool}
      earnings={earnings}
      tokenDecimals={tokenDecimals}
      needsApproval={needsApproval}
      isOldSyrup={isOldSyrup}
      className={className}
    />
  )

  const renderDetailsSection = (className?: string) => (
    <DetailsSection
      tokenName={tokenName}
      bscScanAddress=""
      totalStaked={totalStaked}
      isHorizontal={isHorizontal}
      className={className}
    />
  )

  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
      renderCardHeading={renderCardHeading}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={stakingTokenName}
      renderCardHeading={renderCardHeading}
    />,
  )

  if (isHorizontal) {
    return (
      <HorizontalStyle className="flex align-stretch pa-5 mb-4">
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
