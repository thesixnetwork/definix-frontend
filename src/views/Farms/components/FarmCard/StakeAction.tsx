import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import React from 'react'
import { useFarmUnlockDate } from 'state/hooks'
import styled from 'styled-components'
import { AddIcon, Button, Heading, MinusIcon, useModal } from 'uikit-dev'
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
  justify-content: space-between;
  svg {
    width: 20px;
  }
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

  return (
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
  )
}

export default StakeAction
