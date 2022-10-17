import BigNumber from 'bignumber.js'
import ConnectButton from 'components/ConnectButton'
import { useApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useMemo, useState } from 'react'
import { useFarmFromSymbol, useFarmUnlockDate, useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import { AddIcon, Heading, MinusIcon, Text } from 'uikit-dev'
import { Button } from '@mui/material'
import { getAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/erc20'
import { getBalanceNumber } from 'utils/formatBalance'
import { provider } from 'web3-core'
import { FarmWithStakedValue } from './types'

interface FarmStakeActionProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
  addLiquidityUrl?: string
  className?: string
  onPresentDeposit?: any
  onPresentWithdraw?: any
}

const IconButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: stretch;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmStakeActionProps> = ({
  farm,
  ethereum,
  account,
  className = '',
  onPresentDeposit,
  onPresentWithdraw,
}) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [readyToStake, setReadyToStake] = useState(false)

  const TranslateString = useI18n()
  const { pid, lpAddresses } = useFarmFromSymbol(farm.lpSymbol)
  const { allowance, stakedBalance } = useFarmUser(pid)
  const lpAddress = getAddress(lpAddresses)
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const farmUnlockDate = useFarmUnlockDate()

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderStakingButtons = () => {
    if (!readyToStake && rawStakedBalance === 0) {
      return (
        <Button
          variant="contained"
          color="secondary"
          disabled={farmUnlockDate instanceof Date && new Date().getTime() < farmUnlockDate.getTime()}
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
          disabled={stakedBalance.eq(new BigNumber(0))}
          onClick={onPresentWithdraw}
          style={{ width: '100%' }}
          className="btn-secondary-disable mr-1"
        >
          <MinusIcon style={{ color: '#413343' }}  />
        </Button>
        {(typeof farmUnlockDate === 'undefined' ||
          (farmUnlockDate instanceof Date && new Date().getTime() > farmUnlockDate.getTime())) && (
          <Button
            variant="outlined"
            color="secondary"
            style={{ width: '100%' }}
            onClick={onPresentDeposit}
            className="btn-secondary-disable ml-1"
          >
            <AddIcon style={{ color: '#413343' }}  />
          </Button>
        )}
      </IconButtonWrapper>
    )
  }

  const renderApprovalOrStakeButton = () => {
    if (!isApproved) {
      return (
        <Button
          style={{ width: '100%' }}
          variant="contained"
          color="secondary"
          disabled={requestedApproval}
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
      <Text textAlign="left" className="mb-2" color="textSubtle">{`${TranslateString(1074, 'My Staked')}`}</Text>
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
