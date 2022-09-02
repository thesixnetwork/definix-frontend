import BigNumber from 'bignumber.js'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, ChevronDownIcon, ChevronUpIcon, useMatchBreakpoints } from 'uikit-dev'
import { Box, IconButton, Button, useMediaQuery, useTheme } from '@mui/material'
import Card from 'uikitV2/components/Card'
import { usePriceFinixUsd } from 'state/hooks'
import PoolContext from 'views/Pools/PoolContext'
import PoolSash from '../PoolSash'
import WithdrawModal from '../WithdrawModal'
import CardHeading from './CardHeading'
import CardHeadingAccordion from './CardHeadingAccordion'
import DetailsSection from './DetailsSection'
import HarvestAction from './HarvestAction'
// import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import { PoolCardProps } from './types'
import EarningHarvest from './EarningHarvest'
import MyStake from './MyStake'

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

const CardWrap = styled(Card)`
  margin-bottom: 26px;
  @media screen and (min-width: 1280px) {
    .card-heading {
      width: 204px;
    }
    .total-staked-section {
      width: 144px;
    }
    .my-balance-section {
      margin: 0 24px;
      width: 232px;
    }
    .earnings-section {
      width: 200px;
    }
    .link-section {
      width: 166px;
    }
    .harvest-action-section {
      margin: 0 24px;
      width: 358px;
    }
    .stake-action-section {
      width: 276px;
    }
  }
`
const Wrap = styled(Box)<{ paddingLg: boolean }>`
  padding: ${({ paddingLg }) => (paddingLg ? '40' : '32')}px;
  @media screen and (min-width: 1280px) {
    padding: 32px;
  }
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

  const finixPrice = usePriceFinixUsd()
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
  // numeral(getBalanceNumber(earnings).toLocaleString() * finixPrice.toNumber()).format('0,0.0000');
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
    if (isFinished && sousId !== 0 && sousId !== 25) {
      return <PoolSash type="finish" />
    }

    return null
  }

  const tokenApyList = useMemo(() => {
    return [
      {
        symbol: QuoteToken.FINIX,
        apy: pool.apy,
      },
    ]
  }, [pool])

  const renderCardHeading = useCallback(
    (className?: string) => (
      <CardHeading
        // tokenNames={tokenName}
        // isOldSyrup={isOldSyrup}
        // apy={apy}
        // isHorizontal={isHorizontal}
        // className={className}

        tokenNames={tokenName}
        // isOldSyrup={isOldSyrup}
        tokenApyList={tokenApyList}
        size={isHorizontal && 'small'}
        componentType="pool"
        isFarm={false}
      />
    ),
    [isHorizontal, tokenApyList, tokenName],
  )

  // const renderDepositModal = useCallback(() => {
  //   onPresent(
  //     <DepositModal
  //       max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
  //       onConfirm={onStake}
  //       tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
  //       renderCardHeading={renderCardHeading}
  //     />,
  //   )
  // }, [convertedLimit, onPresent, onStake, renderCardHeading, stakingLimit, stakingTokenBalance, stakingTokenName])

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

  const dataForNextState = useMemo(() => {
    return {
      isOldSyrup,
      isBnbPool,
      pool,
      renderCardHeading,
    }
  }, [isOldSyrup, isBnbPool, pool, renderCardHeading])

  const renderStakeAction = useMemo(
    () => (className?: string, type?: string) =>
      (
        <PoolContext.Consumer>
          {({ goDeposit, goWithdraw }) => (
            <StakeAction
              sousId={sousId}
              isOldSyrup={isOldSyrup}
              tokenName={tokenName}
              stakingTokenAddress={stakingTokenAddress}
              stakedBalance={stakedBalance}
              needsApproval={needsApproval}
              isFinished={isFinished}
              onUnstake={onUnstake}
              onPresentDeposit={() => goDeposit(dataForNextState)}
              onPresentWithdraw={() => goWithdraw(dataForNextState)}
              className={className}
            />
          )}
        </PoolContext.Consumer>
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
      dataForNextState,
    ],
  )

  const renderMyStake = useCallback(
    (className?: string) => (
      <MyStake
        sousId={sousId}
        isOldSyrup={isOldSyrup}
        tokenName={tokenName}
        stakingTokenAddress={stakingTokenAddress}
        stakedBalance={stakedBalance}
        needsApproval={needsApproval}
        isFinished={isFinished}
        onUnstake={onUnstake}
        className={className}
      />
    ),
    [isFinished, isOldSyrup, needsApproval, onUnstake, sousId, stakedBalance, stakingTokenAddress, tokenName],
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

  const renderEarningHarvest = useCallback(
    (className?: string) => (
      <EarningHarvest
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

  // const renderHarvestActionAirDrop = useCallback(
  //   (className?: string, isHor?: boolean) => (
  //     <HarvestActionAirDrop
  //       sousId={sousId}
  //       isBnbPool={isBnbPool}
  //       earnings={earnings}
  //       tokenDecimals={tokenDecimals}
  //       needsApproval={needsApproval}
  //       isOldSyrup={isOldSyrup}
  //       className={className}
  //       isHorizontal={isHor}
  //     />
  //   ),
  //   [earnings, isBnbPool, isOldSyrup, needsApproval, sousId, tokenDecimals],
  // )

  const renderToggleButton = useMemo(
    () => (
      <IconButton size="small" onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
        {isOpenAccordion ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </IconButton>
    ),
    [isOpenAccordion],
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

  return (
    <CardWrap>
      {isMobile ? (
        <>
          <Wrap paddingLg={false}>
            <Flex justifyContent="space-between">
              {renderCardHeading('')}
              {renderToggleButton}
            </Flex>
            {renderEarningHarvest('mt-5')}
          </Wrap>
          {isOpenAccordion && (
            <Box style={{ backgroundColor: 'rgba(224, 224, 224, 0.2)' }} className="px-4 py-5">
              {renderHarvestAction('')}
              <Box className="py-5">{renderStakeAction('accordian')}</Box>
              <div style={{ backgroundColor: 'rgba(224, 224, 224, 0.5)', height: 1 }} />
              <Box className="pt-5" style={{}}>
                {renderDetailsSection('', true)}
              </Box>
            </Box>
          )}
        </>
      ) : (
        <>
          <Wrap paddingLg={false}>
            <Flex justifyContent="space-between">
              <Flex className="card-heading" alignItems="center">
                {renderCardHeading('')}
              </Flex>
              <Box className="total-staked-section">{renderDetailsSection('', true)}</Box>
              <Box className="my-balance-section">{renderMyStake('')}</Box>
              <Box className="earnings-section">{renderEarningHarvest('')}</Box>
              {renderToggleButton}
            </Flex>
          </Wrap>
          {isOpenAccordion && (
            <Box style={{ backgroundColor: 'rgba(224, 224, 224, 0.2)' }} className="px-5 py-4">
              <Flex justifyContent="space-between">
                <Box className="link-section" />
                <Box className="harvest-action-section">
                  {renderHarvestAction('flex align-center justify-space-between')}
                </Box>
                <Box className="stake-action-section">{renderStakeAction('')}</Box>
              </Flex>
            </Box>
          )}
        </>
      )}
    </CardWrap>
  )

  //   if (isHorizontal) {
  //   if (isMobile) {
  //     return (
  //       <HorizontalMobileStyle className="mb-3">
  //         {renderSash()}
  //         <CardHeadingAccordion
  //           tokenName={tokenName}
  //           isOldSyrup={isOldSyrup}
  //           apy={apy}
  //           className=""
  //           isOpenAccordion={isOpenAccordion}
  //           setIsOpenAccordion={setIsOpenAccordion}
  //         />
  //         <div className={`accordion-content ${isOpenAccordion ? 'show' : 'hide'}`}>
  //           {renderStakeAction('pa-5')}
  //           {renderHarvestAction('pa-5')}
  //           {/* {renderHarvestActionAirDrop('pa-5 pt-0', false)} */}
  //           {renderDetailsSection('px-5 py-3', false)}
  //         </div>
  //       </HorizontalMobileStyle>
  //     )
  //   }

  //   return (
  //     <HorizontalStyle className="flex align-stretch px-5 py-6 mb-5">
  //       {renderSash()}
  //       {renderCardHeading('col-3 pos-static')}

  //       <div className="col-4 bd-x flex flex-column justify-space-between px-5">
  //         {renderStakeAction('pb-4')}
  //         {renderDetailsSection('', true)}
  //       </div>

  //       {renderHarvestAction('col-5 pl-5 flex-grow')}
  //       {/* {renderHarvestActionAirDrop('col-5 pl-5 flex-grow', true)} */}
  //     </HorizontalStyle>
  //   )
  // }

  // return (
  //   <VerticalStyle className="mb-7">
  //     {renderSash()}
  //     <div className="flex flex-column flex-grow">
  //       {renderCardHeading('pt-7')}
  //       {renderStakeAction('pa-5')}
  //       {renderHarvestAction('pa-5')}
  //       {/* {renderHarvestActionAirDrop('pa-5 pt-0', false)} */}
  //     </div>
  //     {renderDetailsSection('px-5 py-3', false)}
  //   </VerticalStyle>
  // )
}

export default PoolCard
