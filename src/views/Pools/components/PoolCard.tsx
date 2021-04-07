import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import UnlockButton from 'components/UnlockButton'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { useSousApprove } from 'hooks/useApprove'
import useBlock from 'hooks/useBlock'
import { useERC20 } from 'hooks/useContract'
import { useSousHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import numeral from 'numeral'
import React, { useCallback, useEffect, useState } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import { Pool } from 'state/types'
import styled from 'styled-components'
import { AddIcon, Button, Heading, Image, MinusIcon, Text, useModal } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import colorStroke from '../../../uikit-dev/images/Color-stroke.png'
import Card from './Card'
import CompoundModal from './CompoundModal'
import DepositModal from './DepositModal'
import PoolSash from './PoolSash'
import WithdrawModal from './WithdrawModal'

interface PoolWithApy extends Pool {
  apy: BigNumber
  rewardPerBlock?: number
  estimatePrice: BigNumber
}

interface HarvestProps {
  pool: PoolWithApy
}

function secondsToDhms(i, onlyHour = false) {
  const seconds = Number(i)
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : ''
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
  if (onlyHour) return (dDisplay + hDisplay).replace(/,\s*$/, '')
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : ''
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : ''
  return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, '')
}

const PoolCard: React.FC<HarvestProps> = ({ pool }) => {
  const {
    sousId,
    image,
    tokenName,
    stakingTokenName,
    stakingTokenAddress,
    projectLink,
    harvest,
    apy,
    tokenDecimals,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
    stakingLimit,
    rewardPerBlock,
    estimatePrice,
  } = pool
  const [beforeStartDate, setBeforeStartDate] = useState(0)
  const [endBlockDate, setEndBlockDate] = useState(0)
  const finixPrice = usePriceFinixUsd()
  const block = useBlock()
  const startBlockNumber = typeof startBlock === 'number' ? startBlock : parseInt(startBlock, 10)
  const endBlockNumber = typeof endBlock === 'number' ? endBlock : parseInt(endBlock, 10)
  const currentBlockNumber = typeof block === 'number' ? block : parseInt(block, 10)
  const totalDiffBlock = endBlockNumber - startBlockNumber
  const totalDiffBlockCeil =
    totalDiffBlock % 1200 > 1100 ? totalDiffBlock + (1200 - (totalDiffBlock % 1200)) : totalDiffBlock
  const totalReward = totalDiffBlockCeil * (rewardPerBlock / 10 ** 18)
  const currentDiffBlock = currentBlockNumber - startBlockNumber
  const percentage = currentDiffBlock / (totalDiffBlock / 100)
  const totalTimeInSecond = secondsToDhms(totalDiffBlockCeil * 3, true)
  const remainTime = secondsToDhms((totalDiffBlock - currentDiffBlock) * 3)
  const beforeStart = startBlockNumber - currentBlockNumber
  const endStart = endBlockNumber - currentBlockNumber
  const beforeStartTime = secondsToDhms(beforeStart * 3)
  const beforeStartTimeDate = secondsToDhms(beforeStart * 3)
  const totalBarWidthPercentage = `${(percentage || 0) > 100 ? 100 : percentage || 0}%`
  const alreadyRewarded = currentDiffBlock * (rewardPerBlock / 10 ** 18)
  let totalStakedInt
  switch (typeof totalStaked) {
    case 'undefined':
      totalStakedInt = 0
      break
    case 'string':
      totalStakedInt = (parseFloat(totalStaked) || 0) / 10 ** tokenDecimals
      break
    default:
      totalStakedInt = totalStaked.times(new BigNumber(10).pow(tokenDecimals)).toNumber()
      break
  }

  // eslint-disable-next-line
  let sixPerFinix =
    totalStakedInt /
      (((endBlockNumber - currentBlockNumber) / (endBlockNumber - startBlockNumber)) *
        ((endBlockNumber - startBlockNumber) * (rewardPerBlock / 10 ** 18))) || 0
  if (sixPerFinix < 0) {
    sixPerFinix = 0
  }
  useEffect(() => {
    if (currentBlockNumber !== 0 && beforeStart && !beforeStartDate) {
      setBeforeStartDate(new Date().getTime() + beforeStart * 3 * 1000)
    }
    if (currentBlockNumber !== 0 && endStart && !endBlockDate) {
      setEndBlockDate(new Date().getTime() + endStart * 3 * 1000)
    }
  }, [beforeStart, endStart, beforeStartDate, currentBlockNumber, endBlockDate])
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()
  const stakingTokenContract = useERC20(stakingTokenAddress)
  const { account } = useWallet()
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId)
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const blocksUntilStart = Math.max(startBlock - block, 0)
  const blocksRemaining = Math.max(endBlock - block, 0)
  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  const isCardActive = isFinished && accountHasStakedBalance
  const [readyToStake, setReadyToStake] = useState(false)

  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(tokenDecimals))
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
    />,
  )

  const [onPresentCompound] = useModal(
    <CompoundModal earnings={earnings} onConfirm={onStake} tokenName={stakingTokenName} />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={stakingTokenName} />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])
  let timeData = <p>Loading</p>
  if (currentBlockNumber !== 0) {
    if (currentBlockNumber < startBlockNumber) {
      timeData = <p>Starting in {beforeStartTime}</p>
    } else if (isFinished) {
      timeData = <p>Finished.</p>
    } else {
      timeData = <p>{remainTime} until end.</p>
    }
  }
  const currentDate = new Date()
  const year =
    currentDate.getMonth() === 11 && currentDate.getDate() > 23
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear()
  let dateToFlip = new Date().getTime()
  if (currentBlockNumber !== 0) {
    if (currentBlockNumber < startBlockNumber) {
      dateToFlip = new Date().getTime()
    } else {
      dateToFlip = endBlockDate
    }
  }
  let totalRewardedDisplay = alreadyRewarded > totalReward ? totalReward : alreadyRewarded

  if (totalRewardedDisplay < 0) {
    totalRewardedDisplay = 0
  }
  totalRewardedDisplay = totalReward - totalRewardedDisplay
  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0} className="flex flex-wrap">
      <div className="panel">
        {tokenName === 'FINIX-SIX' && !isFinished && <PoolSash type="special" />}
        {isFinished && sousId !== 0 && <PoolSash type="finish" />}

        <CustomTitle className="bg-gray">
          <Image src={`/images/coins/${tokenName}.png`} width={56} height={56} />
          <Heading as="h2" fontSize="20px !important" className="ml-3" color="inherit">
            {isOldSyrup && '[OLD]'} {tokenName} {TranslateString(348, 'Pool')}
          </Heading>
        </CustomTitle>

        <div className="flex flex-column align-center pa-5">
          <p className="mb-3">
            Stake {tokenName} to earn {sousId === 1 ? 'FINIX' : 'SIX'}
          </p>
          <Image src={sousId === 1 ? '/images/coins/FINIX.png' : '/images/coins/SIX.png'} width={96} height={96} />
        </div>

        <div className="pa-5 pt-0">
          {/* <StyledDetails>
            <p className="pr-4 col-6">APR:</p>
            <div className="col-6">
              <Balance isDisabled={isFinished} value={apy?.toNumber()} decimals={2} unit="%" />
            </div>
          </StyledDetails> */}
          <StyledDetails>
            <p className="pr-4 col-6">Total {sousId === 1 ? 'FINIX' : 'SIX'} Rewards:</p>
            {currentBlockNumber === 0 ? (
              <span className="col-6">Loading</span>
            ) : (
              <div className="col-6 flex align-baseline justify-end flex-wrap" style={{ wordBreak: 'break-word' }}>
                <Balance
                  isDisabled={isFinished}
                  value={totalRewardedDisplay}
                  decimals={2}
                  unit={sousId === 1 ? ' FINIX' : ' SIX'}
                  color="inherit"
                />
                <span className="flex-shrink ml-2" style={{ width: 'auto' }}>
                  /
                </span>
                <Balance
                  isDisabled={isFinished}
                  value={totalReward}
                  decimals={2}
                  unit={sousId === 1 ? ' FINIX' : ' SIX'}
                  color="inherit"
                  className="ml-2"
                />
              </div>
            )}
          </StyledDetails>
          <StyledDetails>
            <p className="pr-4 col-6">Stake period:</p>
            <p className="col-6 text-bold text-right pa-0">{totalTimeInSecond}</p>
          </StyledDetails>
          <StyledDetails>
            <p className="pr-4 col-6">Total {tokenName} Staked:</p>
            <div className="col-6">
              <p className="text-bold text-right">
                {numeral(getBalanceNumber(totalStaked)).format('0,0.0000')} {tokenName}
              </p>
              {/* <p className="ml-1 text-right">= ${numeral(estimatePrice.toNumber()).format('0,0.0000')}</p> */}
            </div>
          </StyledDetails>
        </div>

        {/* <div style={{ padding: '24px' }}>
          <CardTitle isFinished={isFinished && sousId !== 0}>
            {isOldSyrup && '[OLD]'} {tokenName} {TranslateString(348, 'Pool')}
          </CardTitle>

          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <Image src={`/images/tokens/${image || tokenName}.png`} width={64} height={64} alt={tokenName} />
            </div>
            {account && harvest && !isOldSyrup && (
              <HarvestButton
                disabled={!earnings.toNumber() || pendingTx}
                text={pendingTx ? 'Collecting' : 'Harvest'}
                onClick={async () => {
                  setPendingTx(true)
                  await onReward()
                  setPendingTx(false)
                }}
              />
            )}
          </div>
          {!isOldSyrup ? (
            <BalanceAndCompound>
              <Balance value={getBalanceNumber(earnings, tokenDecimals)} isDisabled={isFinished} />
              {sousId === 0 && account && harvest && (
                <HarvestButton
                  disabled={!earnings.toNumber() || pendingTx}
                  text={pendingTx ? TranslateString(999, 'Compounding') : TranslateString(704, 'Compound')}
                  onClick={onPresentCompound}
                />
              )}
            </BalanceAndCompound>
          ) : (
            <OldSyrupTitle hasBalance={accountHasStakedBalance} />
          )}
          <Label isFinished={isFinished && sousId !== 0} text={TranslateString(330, `${tokenName} earned`)} />

          <StyledCardActions>
            {!account && <UnlockButton />}
            {account &&
              (needsApproval && !isOldSyrup ? (
                <div style={{ flex: 1 }}>
                  <Button disabled={isFinished || requestedApproval} onClick={handleApprove} fullWidth>
                    Approve
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
                    onClick={
                      isOldSyrup
                        ? async () => {
                            setPendingTx(true)
                            await onUnstake('0')
                            setPendingTx(false)
                          }
                        : onPresentWithdraw
                    }
                  >
                    {`Unstake ${stakingTokenName}`}
                  </Button>
                  <StyledActionSpacer />
                  {!isOldSyrup && (
                    <IconButton disabled={isFinished && sousId !== 0} onClick={onPresentDeposit}>
                      <AddIcon color="background" />
                    </IconButton>
                  )}
                </>
              ))}
          </StyledCardActions>

          <StyledDetails>
            <div style={{ flex: 1 }}>{TranslateString(736, 'APR')}:</div>
            {isFinished || isOldSyrup || !apy || apy?.isNaN() || !apy?.isFinite() ? (
              '-'
            ) : (
              <Balance fontSize="14px" isDisabled={isFinished} value={apy?.toNumber()} decimals={2} unit="%" />
            )}
          </StyledDetails>

          <StyledDetails>
            <div style={{ flex: 1 }}>
              <span role="img" aria-label={stakingTokenName}>
                🥞{' '}
              </span>
              {TranslateString(384, 'Your Stake')}:
            </div>
            <Balance fontSize="14px" isDisabled={isFinished} value={getBalanceNumber(stakedBalance)} />
          </StyledDetails>
        </div>
        <CardFooter
          projectLink={projectLink}
          totalStaked={totalStaked}
          blocksRemaining={blocksRemaining}
          isFinished={isFinished}
          blocksUntilStart={blocksUntilStart}
          poolCategory={poolCategory}
        /> */}
      </div>

      <div className="panel compare-box pa-6 pt-0">
        <CustomTitle>
          <Heading as="h2" className="mr-2" color="inherit">
            My Funds
          </Heading>
          <Image src={`/images/coins/${tokenName}.png`} width={40} height={40} />
        </CustomTitle>

        <div className="flex flex-column align-center">
          <p className="mb-2">{tokenName} Staked</p>
          <Balance isDisabled={isFinished} value={getBalanceNumber(stakedBalance)} />
          <Text className="mt-1" fontSize="16px" fontWeight="bold" color="inherit">
            {tokenName}
          </Text>
        </div>

        <div className="flex flex-column align-stretch justify-end mt-6">
          {!account && <UnlockButton fullWidth />}
          {account &&
            (needsApproval && !isOldSyrup ? (
              <Button disabled={isFinished || requestedApproval} onClick={handleApprove} fullWidth>
                Approve
              </Button>
            ) : (
              <div className="flex">
                {!readyToStake && stakedBalance.eq(new BigNumber(0)) && !isFinished ? (
                  <Button
                    onClick={() => {
                      setReadyToStake(true)
                    }}
                    fullWidth
                  >
                    Stake
                  </Button>
                ) : (
                  <>
                    <Button
                      fullWidth
                      disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
                      onClick={
                        isOldSyrup
                          ? async () => {
                              setPendingTx(true)
                              await onUnstake('0')
                              setPendingTx(false)
                            }
                          : onPresentWithdraw
                      }
                      variant="secondary"
                      className="btn-secondary-disable"
                    >
                      <MinusIcon color={stakedBalance.eq(new BigNumber(0)) || pendingTx ? 'textDisabled' : 'primary'} />
                    </Button>
                    {!isOldSyrup && !isFinished && (
                      <Button
                        fullWidth
                        disabled={isFinished && sousId !== 0}
                        onClick={onPresentDeposit}
                        variant="secondary"
                        className="ml-2 btn-secondary-disable"
                      >
                        <AddIcon color="primary" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="panel compare-box pa-6 pt-0">
        <CustomTitle>
          <Heading as="h2" className="mr-2" color="inherit">
            My Rewards
          </Heading>
          <Image src={sousId === 1 ? '/images/coins/FINIX.png' : '/images/coins/SIX.png'} width={40} height={40} />
        </CustomTitle>

        <div className="flex flex-column align-center">
          <p className="mb-2">{sousId === 1 ? 'FINIX' : 'SIX'} Earned</p>
          <Balance value={getBalanceNumber(earnings, tokenDecimals)} isDisabled={isFinished} />
          <Text className="mt-1" fontSize="16px" fontWeight="bold" color="inherit">
            {sousId === 1 ? 'FINIX' : 'SIX'}
          </Text>
        </div>

        <div className="flex flex-column align-stretch justify-end mt-6">
          <Button
            fullWidth
            disabled={!account || (needsApproval && !isOldSyrup) || !earnings.toNumber() || pendingTx}
            onClick={async () => {
              setPendingTx(true)
              await onReward()
              setPendingTx(false)
            }}
          >
            {pendingTx ? 'Collecting' : 'Claim Rewards'}
          </Button>
        </div>
      </div>

      <img src={colorStroke} alt="" className="color-stroke" />
    </Card>
  )
}

const CustomTitle = styled.div`
  height: 80px;
  margin-top: 24px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.bg-gray {
    background: ${({ theme }) => theme.colors.backgroundBox};
  }
`

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 12px 0;
  line-height: 1.5;

  p,
  span {
    font-size: 14px;
  }

  > p,
  > span {
    width: 50%;
  }
  > p {
    padding-right: 0.5rem;
  }
  > span {
    text-align: right;
    font-weight: bold;
  }

  .col-6 > div {
    font-size: initial;
  }
`

export default PoolCard
