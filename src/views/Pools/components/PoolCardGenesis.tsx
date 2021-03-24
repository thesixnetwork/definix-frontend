import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
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
import React, { useCallback, useState } from 'react'
import { Pool } from 'state/types'
import styled from 'styled-components'
import { AddIcon, ArrowBackIcon, Button, Heading, IconButton, Image, Link, MinusIcon, useModal } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import CardStake from 'views/Home/components/CardStake'
import { usePriceFinixBusd } from 'state/hooks'
import colorStroke from '../../../uikit-dev/images/Color-stroke.png'
import Card from './Card'
import CompoundModal from './CompoundModal'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'

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
  const finixPrice = usePriceFinixBusd()
  const block = useBlock()
  const startBlockNumber = typeof startBlock === 'number' ? startBlock : parseInt(startBlock, 10)
  const endBlockNumber = typeof endBlock === 'number' ? endBlock : parseInt(endBlock, 10)
  const currentBlockNumber = typeof block === 'number' ? block : parseInt(block, 10)
  const totalDiffBlock = endBlockNumber - startBlockNumber
  const totalReward = totalDiffBlock * (rewardPerBlock / 10 ** 18)
  const currentDiffBlock = currentBlockNumber - startBlockNumber
  const percentage = currentDiffBlock / (totalDiffBlock / 100)
  const totalTimeInSecond = secondsToDhms(totalDiffBlock * 3, true)
  const remainTime = secondsToDhms((totalDiffBlock - currentDiffBlock) * 3)
  const totalBarWidthPercentage = `${percentage || 0}%`
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

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0} className="flex flex-column align-stretch">
      {isFinished && sousId !== 0 && <PoolFinishedSash />}

      <IconButton variant="text" as="a" href="/" area-label="go back" className="ma-3">
        <ArrowBackIcon />
      </IconButton>

      <CardStake />

      <div className="pa-3">
        <MaxWidth>
          <div className="mx-3 my-1">
            <StyledDetails>
              <p className="pr-4 col-6">APR:</p>
              <div className="col-6">
                <Balance isDisabled={isFinished} value={apy?.toNumber()} decimals={2} unit="%" />
              </div>
            </StyledDetails>
            <StyledDetails>
              <p className="pr-4 col-6">Total FINIX Rewards</p>
              <div className="col-6">
                <Balance isDisabled={isFinished} value={totalReward} decimals={2} unit=" FINIX" />
              </div>
            </StyledDetails>
            <StyledDetails>
              <p className="pr-4 col-6">Stake period</p>
              <span className="col-6">{totalTimeInSecond}</span>
            </StyledDetails>
            <StakePeriod>
              <div className="track">
                <div className="progress" style={{ width: totalBarWidthPercentage }} />
              </div>
              <p>{remainTime} until end.</p>
            </StakePeriod>
            <StyledDetails>
              <p className="pr-4 col-6">Total {tokenName} Staked:</p>
              <div className="col-6">
                <Balance
                  isDisabled={isFinished}
                  value={getBalanceNumber(totalStaked)}
                  decimals={2}
                  unit={` ${tokenName}`}
                />
              </div>
            </StyledDetails>
          </div>
        </MaxWidth>
      </div>

      <BorderTopBox>
        <Flex>
          <div className="compare-box pa-5">
            <CustomTitle>
              <Heading as="h2" className="mr-3">
                My Funds
              </Heading>
              <Image src={`/images/coins/${tokenName}.png`} width={40} height={40} />
            </CustomTitle>

            <div className="flex flex-column align-center mb-5">
              <p className="mb-2">{tokenName} Staked</p>
              <Balance isDisabled={isFinished} value={getBalanceNumber(stakedBalance)} />
              <p className="mt-2">{tokenName}</p>
            </div>

            <div className="flex flex-column align-stretch justify-end">
              <Link href="https://six.network" target="_blank" className="mx-auto mb-4">
                Buy {tokenName}
              </Link>
            </div>
          </div>

          <div className="compare-box pa-5">
            <CustomTitle>
              <Heading as="h2" className="mr-3">
                My Rewards
              </Heading>
              <Image src="/images/coins/FINIX.png" width={40} height={40} />
            </CustomTitle>

            <div className="flex flex-column align-center mb-5">
              <p className="mb-2">FINIX Earned</p>
              <Balance value={getBalanceNumber(earnings, tokenDecimals)} isDisabled={isFinished} />
              <p className="mt-2">FINIX</p>
            </div>

            <div className="flex flex-column align-stretch justify-end">
              <p className="mx-auto mb-4" style={{ lineHeight: '24px' }}>
                = {numeral(finixPrice.toNumber() * getBalanceNumber(earnings, tokenDecimals)).format('0,0.0000')} $
              </p>
            </div>
          </div>
        </Flex>

        <div className="mx-auto my-3" style={{ width: '240px' }}>
          {!account && <UnlockButton fullWidth />}
          {account &&
            (needsApproval && !isOldSyrup ? (
              <Button disabled={isFinished || requestedApproval} onClick={handleApprove} fullWidth>
                Approve
              </Button>
            ) : (
              <div className="flex">
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
                >
                  <MinusIcon color={stakedBalance.eq(new BigNumber(0)) || pendingTx ? 'textDisabled' : 'primary'} />
                </Button>
                {!isOldSyrup && (
                  <Button
                    fullWidth
                    disabled={isFinished && sousId !== 0}
                    onClick={onPresentDeposit}
                    variant="secondary"
                    className="ml-2"
                  >
                    <AddIcon color="primary" />
                  </Button>
                )}
              </div>
            ))}
        </div>
      </BorderTopBox>

      <img src={colorStroke} alt="" className="color-stroke" />
    </Card>
  )
}

const CustomTitle = styled.div`
  height: 80px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.bg-gray {
    background: ${({ theme }) => theme.colors.backgroundBox};
  }
`

const PoolFinishedSash = styled.div`
  background-image: url('/images/pool-finished-sash.svg');
  background-position: top right;
  background-repeat: not-repeat;
  height: 135px;
  position: absolute;
  right: -24px;
  top: -24px;
  width: 135px;
  z-index: 1;
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
    line-height: 0;
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
    width: 100%;
    margin: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    .compare-box {
      width: calc(50% - 32px);
    }
  }
`

const BorderTopBox = styled.div`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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
