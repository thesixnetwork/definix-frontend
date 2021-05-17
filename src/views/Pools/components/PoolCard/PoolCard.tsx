import BigNumber from 'bignumber.js'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import React from 'react'
import styled from 'styled-components'
import PoolSash from '../PoolSash'
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
      isBnbPool={isBnbPool}
      isOldSyrup={isOldSyrup}
      tokenName={tokenName}
      stakingTokenName={stakingTokenName}
      stakingTokenAddress={stakingTokenAddress}
      stakingTokenBalance={stakingTokenBalance}
      stakedBalance={stakedBalance}
      convertedLimit={convertedLimit}
      needsApproval={needsApproval}
      isFinished={isFinished}
      stakingLimit={stakingLimit}
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
      {renderCardHeading('pt-6')}
      {renderStakeAction('pa-5')}
      {renderHarvestAction('pa-5')}
      {renderDetailsSection('px-5 py-3')}
    </VerticalStyle>
  )
}

export default PoolCard
