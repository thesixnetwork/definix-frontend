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
import { AddIcon, ArrowBackIcon, Button, Heading, IconButton, Image, Link, MinusIcon, useModal } from 'uikit-dev'
import bg from 'uikit-dev/images/for-Farm-Elements/bg.jpg'
import { getBalanceNumber } from 'utils/formatBalance'
import CardStake from 'views/Home/components/CardStake'
import Flip from '../../../uikit-dev/components/Flip'
import man from '../../../uikit-dev/images/for-Farm-Elements/1555.png'
import bridge from '../../../uikit-dev/images/Menu-Icon/bridge.png'
import Card from './Card'
import CompoundModal from './CompoundModal'
import DepositModal from './DepositModal'
import PoolSash from './PoolSash'
import WithdrawModal from './WithdrawModal'
// import colorStroke from '../../../uikit-dev/images/Color-stroke.png'

interface PoolWithApy extends Pool {
  apy: BigNumber
  rewardPerBlock?: number
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

const PoolCardGenesis: React.FC<HarvestProps> = ({ pool }) => {
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
    <Card
      isActive={isCardActive}
      isFinished={isFinished && sousId !== 0}
      className="flex flex-column align-stretch mx-auto"
      style={{ maxWidth: '1000px', padding: '0' }}
    >
      {isFinished && sousId !== 0 && <PoolSash type="finish" />}
      <div className="flex justify-space-between">
        <IconButton variant="text" as="a" href="/dashboard" area-label="go back" className="ma-3">
          <ArrowBackIcon />
        </IconButton>
        <Link
          href="https://bridge.six.network/"
          target="_blank"
          className="ma-3 flex justify-space-between align-center"
        >
          <img src={bridge} alt="bridge" width="24" className="mr-1" style={{ width: '24px', height: '24px' }} />
          Bridge
        </Link>
      </div>
      <CardStake />
      <div className="pa-3">
        <MaxWidth>
          <div className="mx-3 my-1">
            <StyledDetails>
              <p className="pr-4 col-6">Reward Ratio</p>
              <span className="col-6">
                1 FINIX : {sixPerFinix === 0 ? '∞' : numeral(sixPerFinix).format('0,0.0000')} SIX
              </span>
              {/* <div className="col-6">
                <Balance isDisabled={isFinished} value={apy?.toNumber()} decimals={2} unit="%" />
              </div> */}
            </StyledDetails>
            <StyledDetails>
              <p className="pr-4 col-6">Total FINIX Rewards</p>
              {currentBlockNumber === 0 ? (
                <span className="col-6">Loading</span>
              ) : (
                <div className="col-6 flex align-baseline justify-end flex-wrap" style={{ wordBreak: 'break-word' }}>
                  <Balance isDisabled={isFinished} value={totalRewardedDisplay} decimals={2} unit=" FINIX" />
                  <span className="flex-shrink" style={{ width: '20px', textAlign: 'center' }}>
                    /
                  </span>
                  <Balance isDisabled={isFinished} value={totalReward} decimals={2} unit=" FINIX" />
                </div>
              )}
            </StyledDetails>
            <StyledDetails>
              <p className="pr-4 col-6">Stake period</p>
              <span className="col-6">{totalTimeInSecond}</span>
            </StyledDetails>

            <Flip date={dateToFlip} />
            {/* <StakePeriod>
              <div className="track">
                <div className="progress" style={{ width: totalBarWidthPercentage }} />
              </div>
              <p>{remainTime} until end.</p>
            </StakePeriod> */}

            <StyledDetails>
              <p className="pr-4 col-6">Total {tokenName} Staked:</p>
              {getBalanceNumber(totalStaked) ? (
                <div className="col-6">
                  <Balance
                    isDisabled={isFinished}
                    value={getBalanceNumber(totalStaked)}
                    decimals={2}
                    unit={` ${tokenName}`}
                  />
                </div>
              ) : (
                <span className="col-6">0</span>
              )}
            </StyledDetails>
          </div>
        </MaxWidth>
      </div>
      <BorderTopBox>
        <Flex>
          <HalfBox>
            <div className="compare-box pa-6">
              <CustomTitle>
                <Heading as="h2" className="mr-3">
                  My Funds
                </Heading>
              </CustomTitle>

              <div className="flex flex-column align-center mb-7">
                <div className="flex align-center mb-1">
                  <Coin>
                    <Image src={`/images/coins/${tokenName}.png`} width={40} height={40} />
                  </Coin>
                  <p>Staked</p>
                </div>
                <Balance isDisabled={isFinished} value={getBalanceNumber(stakedBalance)} />
                <p className="mt-2 text-bold">{tokenName}</p>
              </div>

              <div className="flex flex-column align-stretch justify-end">
                <Link href="https://exchange.definix.com/#/swap" target="_blank" className="mx-auto">
                  {' '}
                </Link>
              </div>
            </div>
            <div className="mx-3 mt-6 mb-4">
              {!account && <UnlockButton fullWidth />}
              {account &&
                (needsApproval && !isOldSyrup ? (
                  <Button disabled={isFinished || requestedApproval} onClick={handleApprove} fullWidth>
                    Approve
                  </Button>
                ) : (
                  <div className="flex">
                    {stakedBalance.toNumber() === 0 ? (
                      <Button disabled={isFinished && sousId !== 0} onClick={onPresentDeposit} fullWidth>
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
                          <MinusIcon
                            color={stakedBalance.eq(new BigNumber(0)) || pendingTx ? 'textDisabled' : 'primary'}
                          />
                        </Button>
                        {!isOldSyrup && (
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
          </HalfBox>

          <HalfBox>
            <div className="compare-box pa-6">
              <CustomTitle>
                <Heading as="h2" className="mr-3">
                  My Rewards
                </Heading>
              </CustomTitle>

              <div className="flex flex-column align-center mb-7">
                <div className="flex align-center mb-1">
                  <Coin>
                    <Image src="/images/coins/FINIX.png" width={40} height={40} />
                  </Coin>
                  <p>Earned</p>
                </div>
                <Balance value={getBalanceNumber(earnings, tokenDecimals)} isDisabled={isFinished} />
                <p className="mt-2 text-bold">FINIX</p>
              </div>

              <div className="flex flex-column align-stretch justify-end">
                <p className="mx-auto" style={{ lineHeight: '24px' }}>
                  = {numeral(finixPrice.toNumber() * getBalanceNumber(earnings, tokenDecimals)).format('0,0.0000')} $
                </p>
              </div>
            </div>
            <div className="mx-3 mt-6 mb-4">
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
          </HalfBox>
        </Flex>
      </BorderTopBox>
      <NextStep>
        <MaxWidth>
          <img src={man} alt="" />

          <div>
            <Heading as="h2" fontSize="28px !important" color="#FFF" className="mb-2">
              Next Step
            </Heading>
            <div className="flex">
              <p>
                After you claim your rewards, <strong>you can start farming to earn much more FINIX.</strong> Let’s farm
                now!
              </p>
              <Button as="a" href="/farm" variant="secondary" className="btn-secondary-disable">
                Go to farm
              </Button>
            </div>
          </div>
        </MaxWidth>
      </NextStep>
      {/* <img src={colorStroke} alt="" className="color-stroke" /> */}
    </Card>
  )
}

const NextStep = styled.div`
  padding: 24px;
  width: 100%;
  background: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 25% center;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  border-bottom-left-radius: ${({ theme }) => theme.radii.default};
  border-bottom-right-radius: ${({ theme }) => theme.radii.default};

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .flex {
      flex-direction: column;
    }
  }

  img {
    width: 160px;
  }

  p {
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  a {
    flex-shrink: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    background-position: center 40%;

    > div {
      flex-direction: row;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > div .flex {
      flex-direction: row;
    }

    p {
      margin: 0;
    }

    a {
      margin-left: 2rem;
    }
  } ;
`

const CustomTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;

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

const Coin = styled.div`
  margin-right: 12px;
  flex-shrink: 0;
  width: 40px;
`

const StyledDetails = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 12px 0;
  flex-wrap: wrap;

  p,
  span {
    width: 50%;
    font-size: 14px;
  }
  p {
    padding-right: 0.5rem;
  }
  span {
    text-align: right;
    font-weight: bold;
  }

  .col-6 > div {
    line-height: 1;
    font-size: initial;
  }
`

const MaxWidth = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`

const Flex = styled(MaxWidth)`
  display: flex;
  flex-wrap: wrap;
  .compare-box {
    width: calc(100% - 32px);
    margin: 16px;
    height: 300px;
  }
`

const BorderTopBox = styled.div`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const HalfBox = styled.div`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 50%;
  }
`

const StakePeriod = styled.div`
  margin: 16px 0 8px 0;

  .track {
    position: relative;
    height: 16px;
    background: ${({ theme }) => theme.colors.backgroundDisabled};
    border-radius: 16px;
    margin-bottom: 12px;

    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 16px;
      background: ${({ theme }) => theme.colors.primary};
    }
  }

  p {
    font-size: 12px;
    text-align: center;
  }
`

export default PoolCardGenesis
