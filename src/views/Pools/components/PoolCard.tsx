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
import React, { useCallback, useState } from 'react'
import { Pool } from 'state/types'
import styled from 'styled-components'
import { AddIcon, Button, Heading, Image, Link, MinusIcon, useModal } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import colorStroke from '../../../uikit-dev/images/Color-stroke.png'
import Card from './Card'
import CompoundModal from './CompoundModal'
import DepositModal from './DepositModal'
import PoolFinishedSash from './PoolFinishedSash'
import WithdrawModal from './WithdrawModal'

interface PoolWithApy extends Pool {
  apy: BigNumber
}

interface HarvestProps {
  pool: PoolWithApy
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
  } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()
  const stakingTokenContract = useERC20(stakingTokenAddress)
  const { account } = useWallet()
  const block = useBlock()
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

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0} className="flex flex-wrap">
      <div className="panel">
        {isFinished && sousId !== 0 && <PoolFinishedSash />}

        <CustomTitle className="bg-gray">
          <Image src={`/images/coins/${tokenName}.png`} width={56} height={56} />
          <Heading as="h2" fontSize="20px !important" className="ml-3">
            {isOldSyrup && '[OLD]'} {tokenName} {TranslateString(348, 'Pool')}
          </Heading>
        </CustomTitle>

        <div className="flex flex-column align-center pa-5">
          <p className="mb-3">Stake {tokenName} to earn FINIX</p>
          <Image src="/images/coins/FINIX.png" width={96} height={96} />
        </div>

        <div className="pa-5 pt-0">
          <StyledDetails>
            <p className="pr-4 col-6">APR:</p>
            <div className="col-6">
              <Balance isDisabled={isFinished} value={apy?.toNumber()} decimals={2} unit="%" />
            </div>
          </StyledDetails>
          <StyledDetails>
            <p className="pr-4 col-6">Total FINIX Rewards</p>
            <span className="col-6">2,000,000 FINIX</span>
          </StyledDetails>
          <StyledDetails>
            <p className="pr-4 col-6">Today’s FINIX Rewards</p>
            <span className="col-6">0.000000000 FINIX</span>
          </StyledDetails>
          <StyledDetails>
            <p className="pr-4 col-6">Total {tokenName} Staked:</p>
            <span className="col-6">
              {getBalanceNumber(totalStaked)} {tokenName}
            </span>
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

      <div className="panel compare-box pa-5 pt-0 pr-3">
        <CustomTitle>
          <Heading as="h2" className="mr-3">
            My Funds
          </Heading>
          <Image src={`/images/coins/${tokenName}.png`} width={40} height={40} />
        </CustomTitle>

        <div className="flex flex-column align-center">
          <p className="mb-2">{tokenName} Staked</p>
          <Balance isDisabled={isFinished} value={getBalanceNumber(stakedBalance)} />
          <p className="mt-2 text-bold">{tokenName}</p>
        </div>

        <div className="flex flex-column align-stretch justify-end">
          <Link href="https://exchange.definix.com/#/swap" target="_blank" className="mx-auto mb-4">
            Buy {tokenName}
          </Link>
          {!account && <UnlockButton fullWidth />}
          {account &&
            (needsApproval && !isOldSyrup ? (
              <Button disabled={isFinished || requestedApproval} onClick={handleApprove} fullWidth>
                Approve
              </Button>
            ) : (
              <div className="flex">
                {!readyToStake ? (
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
      </div>

      <div className="panel compare-box pa-5 pt-0 pl-3">
        <CustomTitle>
          <Heading as="h2" className="mr-3">
            My Rewards
          </Heading>
          <Image src="/images/coins/FINIX.png" width={40} height={40} />
        </CustomTitle>

        <div className="flex flex-column align-center">
          <p className="mb-2">FINIX Earned</p>
          <Balance value={getBalanceNumber(earnings, tokenDecimals)} isDisabled={isFinished} />
          <p className="mt-2 text-bold">FINIX</p>
        </div>

        <div className="flex flex-column align-stretch justify-end">
          <p className="mx-auto mb-4" style={{ lineHeight: '24px' }}>
            = 0.00000 $
          </p>
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

export default PoolCard
