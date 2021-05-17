import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import React, { useCallback, useMemo, useState } from 'react'
import { useFarmFromSymbol, useFarmUnlockDate, useFarmUser } from 'state/hooks'
import { Farm } from 'state/types'
import styled from 'styled-components'
import { AddIcon, Button, Heading, MinusIcon, Text, useModal } from 'uikit-dev'
import { getAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/erc20'
import { getBalanceNumber } from 'utils/formatBalance'
import { provider } from 'web3-core'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmStakeActionProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
  addLiquidityUrl?: string
  className?: string
}

const IconButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmStakeActionProps> = ({ farm, ethereum, account, addLiquidityUrl, className = '' }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)

  const TranslateString = useI18n()
  const { pid, lpAddresses } = useFarmFromSymbol(farm.lpSymbol)
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
  const lpAddress = getAddress(lpAddresses)
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const farmUnlockDate = useFarmUnlockDate()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress])

  const { onApprove } = useApprove(lpContract)

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={lpName} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(<WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={lpName} />)

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
    return rawStakedBalance === 0 ? (
      <Button
        disabled={farmUnlockDate instanceof Date && new Date().getTime() < farmUnlockDate.getTime()}
        onClick={onPresentDeposit}
        fullWidth
        radii="small"
      >
        {TranslateString(999, 'Stake LP')}
      </Button>
    ) : (
      <IconButtonWrapper>
        <Button variant="secondary" onClick={onPresentWithdraw} className="btn-secondary-disable col-6 mr-1">
          <MinusIcon color="primary" />
        </Button>
        {(typeof farmUnlockDate === 'undefined' ||
          (farmUnlockDate instanceof Date && new Date().getTime() > farmUnlockDate.getTime())) && (
          <Button variant="secondary" onClick={onPresentDeposit} className="btn-secondary-disable col-6 ml-1">
            <AddIcon color="primary" />
          </Button>
        )}
      </IconButtonWrapper>
    )
  }

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <div className="flex align-center">
        <Heading
          fontSize="20px !important"
          textAlign="left"
          color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}
          className="col-6 pr-3"
        >
          {displayBalance}
        </Heading>

        <div className="col-6">{renderStakingButtons()}</div>
      </div>
    ) : (
      <Button fullWidth radii="small" disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(758, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <div className={className}>
      <Text textAlign="left" className="mb-2" color="textSubtle">{`${lpName} ${TranslateString(1074, 'Staked')}`}</Text>
      {!account ? <UnlockButton fullWidth radii="small" /> : renderApprovalOrStakeButton()}
    </div>
  )
}

export default StakeAction
