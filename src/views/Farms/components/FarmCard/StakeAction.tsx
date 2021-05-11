import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import React from 'react'
import styled from 'styled-components'
import { AddIcon, Button, Heading, IconButton, MinusIcon, useModal } from 'uikit-dev'
import { useFarmUnlockDate } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  addLiquidityUrl?: string
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StyledDisplayBalance = styled.div`
  width: 115px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.default};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  addLiquidityUrl,
}) => {
  const farmUnlockDate = useFarmUnlockDate()
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button
        disabled={farmUnlockDate instanceof Date && new Date().getTime() < farmUnlockDate.getTime()}
        onClick={onPresentDeposit}
        fullWidth
      >
        {TranslateString(999, 'Stake LP')}
      </Button>
    ) : (
      <IconButtonWrapper>
        <Button variant="secondary" onClick={onPresentWithdraw} mr="6px" className="btn-secondary-disable">
          <MinusIcon color="primary" />
        </Button>
        {(typeof farmUnlockDate === 'undefined' ||
          (farmUnlockDate instanceof Date && new Date().getTime() > farmUnlockDate.getTime())) && (
          <Button variant="secondary" onClick={onPresentDeposit} className="btn-secondary-disable">
            <AddIcon color="primary" />
          </Button>
        )}
      </IconButtonWrapper>
    )
  }

  return (
    <div className="flex justify-space-between align-strench">
      <StyledDisplayBalance>
        <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      </StyledDisplayBalance>
      {renderStakingButtons()}
    </div>
  )
}

export default StakeAction
