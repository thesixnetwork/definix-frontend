import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button } from '@mui/material'
import BigNumber from 'bignumber.js'
import ConnectButton from 'components/ConnectButton'
import { useSousApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { AddIcon, Heading, MinusIcon, Text } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import { StakeActionProps } from './types'

const IconButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: stretch;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<StakeActionProps> = ({
  sousId,
  isOldSyrup,
  tokenName,
  stakingTokenAddress,
  stakedBalance,
  needsApproval,
  isFinished,
  onUnstake,
  onPresentDeposit,
  onPresentWithdraw,
  className = '',
}) => {
  const TranslateString = useI18n()

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [readyToStake, setReadyToStake] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const { account } = useWallet()
  const stakingTokenContract = useERC20(stakingTokenAddress)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const { onApprove } = useSousApprove(stakingTokenContract, sousId)

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

  const renderStakingButtons = () => {
    if (!readyToStake && stakedBalance.eq(new BigNumber(0)) && !isFinished) {
      return (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setReadyToStake(true)
          }}
          style={{ width: '100%' }}
        >
          {TranslateString(999, 'Stake LP')}
        </Button>
      )
    }

    return (
      <IconButtonWrapper>
        <Button
          variant="outlined"
          color="secondary"
          style={{ width: '100%' }}
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
          className="btn-secondary-disable mr-1"
        >
          <MinusIcon style={{ color: '#413343' }} />
        </Button>

        {!isOldSyrup && !isFinished && (
          <Button
            variant="outlined"
            color="secondary"
            style={{ width: '100%' }}
            disabled={isFinished && sousId !== 0 && sousId !== 25}
            onClick={onPresentDeposit}
            className="btn-secondary-disable  ml-1"
          >
            <AddIcon style={{ color: '#413343' }} />
          </Button>
        )}
      </IconButtonWrapper>
    )
  }

  const renderApprovalOrStakeButton = () => {
    if (needsApproval && !isOldSyrup) {
      return (
        <Button
          variant="contained"
          color="secondary"
          style={{ width: '100%' }}
          disabled={isFinished || requestedApproval}
          onClick={handleApprove}
        >
          {TranslateString(758, 'Approve Contract')}
        </Button>
      )
    }

    return <div className="flex align-center">{renderStakingButtons()}</div>
  }

  return (
    <div className={className}>
      <Text fontSize="0.75rem" textAlign="left" className="mb-2" color="textSubtle">{`${TranslateString(
        1074,
        'My Staked',
      )}`}</Text>
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
