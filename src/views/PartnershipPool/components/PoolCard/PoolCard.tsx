import BigNumber from 'bignumber.js'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstakeVelo } from 'hooks/useUnstake'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { getAddress } from 'utils/addressHelpers'
import { useMatchBreakpoints } from 'uikit-dev'
import PoolContext from 'views/PartnershipPool/PoolContext'
import { getContract } from 'utils/web3'
import ApolloAbi from 'config/abi/Apollo.json'
import DepositModal from '../DepositModal'
import PoolSash from '../PoolSash'
import WithdrawModal from '../WithdrawModal'
import CardHeading from './CardHeading'
import CardHeadingAccordion from './CardHeadingAccordion'
import DetailsSection from './DetailsSection'
import HarvestAction from './HarvestAction'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import { PoolCardVeloProps } from './types'
import CountDown from './Countdown'

const CardStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
`

const VerticalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
  align-self: baseline;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
`

const HorizontalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
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

const PoolCard: React.FC<PoolCardVeloProps> = ({ pool, isHorizontal = false, veloAmount = 0, account }) => {
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
    contractAddress,
  } = pool

  const isBnbPool = poolCategory === PoolCategory.BINANCE
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
  // const x = useContract()
  const { onUnstake } = useSousUnstakeVelo()

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
    console.log(
      'stakingLimit',
      stakingLimit,
      stakingTokenBalance.isGreaterThan(convertedLimit),
      convertedLimit,
      stakingTokenBalance,
    )
    onPresent(
      <DepositModal
        max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
        onConfirm={onStake}
        tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
        renderCardHeading={renderCardHeading}
      />,
    )
  }, [convertedLimit, onStake, onPresent, renderCardHeading, stakingLimit, stakingTokenBalance, stakingTokenName])

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
        apolloAddress={contractAddress[97]}
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
      contractAddress,
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
        veloAmount={veloAmount}
        contractAddrss={getAddress(contractAddress)}
      />
    ),
    [earnings, isBnbPool, isOldSyrup, needsApproval, sousId, tokenDecimals, veloAmount, contractAddress],
  )

  const renderHarvestActionAirDrop = useCallback(
    (className?: string, isHor?: boolean) => (
      <HarvestActionAirDrop
        sousId={sousId}
        isBnbPool={isBnbPool}
        earnings={earnings}
        tokenDecimals={tokenDecimals}
        needsApproval={needsApproval}
        isOldSyrup={isOldSyrup}
        className={className}
        isHorizontal={isHor}
      />
    ),
    [earnings, isBnbPool, isOldSyrup, needsApproval, sousId, tokenDecimals],
  )

  const renderDetailsSection = useCallback(
    (className?: string, isHor?: boolean) => (
      <DetailsSection
        tokenName={tokenName}
        bscScanAddress=""
        totalStaked={totalStaked}
        isHorizontal={isHor}
        className={className}
      />
    ),
    [tokenName, totalStaked],
  )

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  if (isHorizontal) {
    if (isMobile) {
      return (
        <HorizontalMobileStyle className="mb-3">
          {renderSash()}
          <CardHeadingAccordion
            tokenName={tokenName}
            isOldSyrup={isOldSyrup}
            apy={apy}
            className=""
            isOpenAccordion={isOpenAccordion}
            setIsOpenAccordion={setIsOpenAccordion}
          />
          <div className={`accordion-content ${isOpenAccordion ? 'show' : 'hide'}`}>
            {renderStakeAction('pa-5')}
            {renderHarvestAction('pa-5')}
            {/* {renderHarvestActionAirDrop('pa-5 pt-0', false)} */}
            {renderDetailsSection('px-5 py-3', false)}
          </div>
        </HorizontalMobileStyle>
      )
    }
    const x = true
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <CountDown showCom={x} />
        </div>
        <HorizontalStyle className="flex align-stretch px-5 py-6 mb-5">
          {renderSash()}
          {renderCardHeading('col-3 pos-static')}

          <div className="col-4 bd-x flex flex-column justify-space-between px-5">
            {renderStakeAction('pb-4')}
            {renderDetailsSection('', true)}
          </div>

          {renderHarvestAction('col-5 pl-5 flex-grow')}
          {/* {renderHarvestActionAirDrop('col-5 pl-5 flex-grow', true)} */}
        </HorizontalStyle>
      </div>
    )
  }
  const x = true
  return (
    <div style={{ margin: 'auto' }}>
      <div style={{ display: 'flex' }}>
        <CountDown showCom={x} margin="auto" />
      </div>
      <VerticalStyle className="mb-7">
        {renderSash()}
        <div className="flex flex-column flex-grow">
          {renderCardHeading('pt-7')}
          {renderStakeAction('pa-5')}
          {renderHarvestAction('pa-5')}
          {/* {renderHarvestActionAirDrop('pa-5 pt-0', false)} */}
        </div>
        {renderDetailsSection('px-5 py-3', false)}
      </VerticalStyle>
    </div>
  )
}

export default PoolCard
