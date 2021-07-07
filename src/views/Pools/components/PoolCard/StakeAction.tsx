import { useWallet } from 'klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useSousApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { AddIcon, Button, Heading, MinusIcon, Text } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import numeral from 'numeral'
import { StakeActionProps } from './types'

const IconButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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
  const { t } = useTranslation()

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [readyToStake, setReadyToStake] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const { account } = useWallet()
  const stakingTokenContract = useERC20(stakingTokenAddress)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = numeral(rawStakedBalance || 0).format('0,0.0[0000000000]')

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
          onClick={() => {
            setReadyToStake(true)
          }}
          fullWidth
          radii="small"
        >
          {t('Stake LP')}
        </Button>
      )
    }

    return (
      <IconButtonWrapper>
        <Button
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

        {!isOldSyrup && !isFinished && (
          <Button
            variant="secondary"
            disabled={isFinished && sousId !== 0}
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
        <Button fullWidth radii="small" disabled={isFinished || requestedApproval} onClick={handleApprove}>
          {t('Approve Contract')}
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
      <Text textAlign="left" className="mb-2" color="textSubtle">{`${tokenName} ${t('Staked')}`}</Text>
      {!account ? <UnlockButton fullWidth radii="small" /> : renderApprovalOrStakeButton()}
    </div>
  )
}

export default StakeAction
