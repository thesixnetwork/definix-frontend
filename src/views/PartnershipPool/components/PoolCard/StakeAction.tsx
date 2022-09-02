import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useERC20 } from 'hooks/useContract'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { AddIcon, Button, Heading, MinusIcon, Text } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import { ethers } from 'ethers'
import ConnectButton from 'components/ConnectButton'
import { StakeActionProps } from './types'

const IconButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  svg {
    width: 20px;
  }
`
const MiniLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 8px;
  display: inline-block;
`

const StakeAction: React.FC<StakeActionProps> = ({
  isOldSyrup,
  stakingTokenAddress,
  stakedBalance,
  needsApproval,
  isFinished,
  onUnstake,
  onPresentWithdraw,
  className = '',
  apolloAddress,
  veloId,
  onPresentDeposit,
}) => {
  const TranslateString = useI18n()

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [readyToStake, setReadyToStake] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const { account } = useWallet()
  const stakingTokenContract = useERC20(stakingTokenAddress)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  // const { onApprove } = useSousApprove(stakingTokenContract, sousId)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)

      const txHash = await stakingTokenContract.methods
        .approve(apolloAddress, ethers.constants.MaxUint256)
        .send({ from: account })
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [setRequestedApproval, account, stakingTokenContract, apolloAddress])

  const renderStakingButtons = () => {
    if (!readyToStake && stakedBalance.eq(new BigNumber(0)) && !isFinished) {
      return (
        <Button
          color="rgb(94, 81, 95)"
          onClick={() => {
            setReadyToStake(true)
          }}
          fullWidth
          radii="small"
        >
          {TranslateString(999, 'Stake')}
        </Button>
      )
    }

    return (
      <IconButtonWrapper>
        <Button
          color="rgb(94, 81, 95)"
          variant="secondary"
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
          className="btn-secondary-disable col-6 mr-1"
        >
          <MinusIcon color="primary" />
        </Button>

        {!isOldSyrup && !isFinished && veloId !== 1 && (
          <Button
            color="rgb(94, 81, 95)"
            variant="secondary"
            disabled={isFinished || veloId === 1}
            onClick={onPresentDeposit}
            className="btn-secondary-disable col-6 ml-1"
          >
            <AddIcon color="primary" />
          </Button>
        )}
      </IconButtonWrapper>
    )
  }

  const renderApprovalOrStakeButton = () => {
    if (needsApproval && !isOldSyrup) {
      return (
        <Button
          color="rgb(94, 81, 95)"
          fullWidth
          radii="small"
          disabled={isFinished || requestedApproval}
          onClick={handleApprove}
        >
          {TranslateString(758, 'Approve Contract')}
        </Button>
      )
    }

    return (
      <div className="flex align-center">
        <Heading
          fontSize="20px !important"
          textAlign="left"
          color={getBalanceNumber(stakedBalance) === 0 ? 'textDisabled' : 'text'}
          className="col-6 pr-3"
        >
          {displayBalance}
        </Heading>

        <div className="col-6">{renderStakingButtons()}</div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Text fontSize="0.75rem" textAlign="left" className="mb-2 flex align-center" color="textSubtle">
        <MiniLogo src="/images/coins/finix.png" alt="" />
        {`${TranslateString(1074, 'My Staked')}`}
      </Text>
      {!account ? (
        <ConnectButton
          variant="contained"
          color="secondary"
          style={{ padding: '10px 20px', fontSize: '0.875rem', width: '100%', fontWeight: 'bold' }}
        >
          Connect Wallet
        </ConnectButton>
      ) : (
        renderApprovalOrStakeButton()
      )}
    </div>
  )
}

export default StakeAction
